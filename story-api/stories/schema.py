import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from urllib.parse import unquote

from .models import Story
from characters.models import Character
from users.models import User

from chat.schema import MessageType


class StoryType(DjangoObjectType):
    class Meta:
        model = Story
        convert_choices_to_enum = False

    user_is_author = graphene.Boolean()
    users_count = graphene.Int()
    messages_after_reconnect = graphene.List(
        MessageType, message_id=graphene.ID())

    def resolve_user_is_author(self, info):
        if self.author == info.context.user:
            return True
        else:
            return False

    def resolve_users_count(self, info):
        return self.users_in_story.count() + 1

    def resolve_messages_after_reconnect(self, info, message_id):
        return self.message_set.filter(id__gt=message_id).order_by('-created_at')


class Query(graphene.ObjectType):
    story_by_id = graphene.Field(
        StoryType, id=graphene.ID(required=True))
    story_by_id_after_reconnect = graphene.Field(
        StoryType, id=graphene.ID(required=True))
    stories = graphene.List(StoryType)
    find_stories = graphene.List(StoryType, language=graphene.String())

    @login_required
    def resolve_story_by_id(self, info, id):
        try:
            story = Story.objects.get(id=id)
            user = info.context.user
            if user == story.author or user in story.users_in_story.all():
                return story
            else:
                return None
        except Story.DoesNotExist:
            return None

    @login_required
    def resolve_story_by_id_after_reconnect(self, info, id):
        try:
            story = Story.objects.get(id=id)
            user = info.context.user
            if user == story.author or user in story.users_in_story.all():
                return story
            else:
                return None
        except Story.DoesNotExist:
            return None

    @login_required
    def resolve_stories(self, info, **kwargs):
        user = info.context.user
        return Story.objects.user_stories(user)

    @login_required
    def resolve_find_stories(self, info, language):
        user = info.context.user
        stories = Story.objects.stories_found(user, language)
        return stories


class CreateStory(graphene.Mutation):
    story = graphene.Field(StoryType)

    class Arguments:
        title = graphene.String()
        plot = graphene.String()
        number_of_users_in_story = graphene.Int()
        language = graphene.String()
        female_number = graphene.Int()
        male_number = graphene.Int()
        additional_characters = graphene.String()

    @login_required
    def mutate(self, info, title, plot, number_of_users_in_story, female_number, male_number, language, additional_characters):
        story = Story(author=info.context.user, title=unquote(title.strip()), plot=unquote(plot.strip()),
                      number_of_users_in_story=number_of_users_in_story, language=language)

        if female_number + male_number <= number_of_users_in_story:
            story.male_number = male_number
            story.female_number = female_number

        story.save()

        if additional_characters != '':
            additional_characters_list = additional_characters.split(',')
            if len(additional_characters_list) != 0:
                for character_id in additional_characters_list:
                    try:
                        character = Character.objects.get(id=character_id)
                        if character.user == info.context.user:
                            story.additional_characters.add(character)
                    except Character.DoesNotExist:
                        pass

        channel_layer = get_channel_layer()

        ws_room_name = f'stories_found_{story.language}'

        ws_data = {
            'type': 'add_story_event',
            'data': {
                'id': story.id,
                'title': story.title,
                'plot': story.plot,
                'numberOfUsersInStory': story.number_of_users_in_story,
            },
            'is_story_available_data': {
                'male_number': story.male_number,
                'female_number': story.female_number,
            }
        }

        async_to_sync(channel_layer.group_send)(ws_room_name, ws_data)

        return CreateStory(story=story)


class DeleteStory(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            story = Story.objects.get(id=id)
            user = info.context.user

            if story.author == user:
                channel_layer = get_channel_layer()

                ws_room_name = f'stories_found_{story.language}'
                ws_chat_room_name = f'story_chat_{story.id}'

                story.delete()

                ws_data = {
                    'type': 'delete_story_event',
                    'data': {
                        'id': id
                    }
                }

                ws_chat_data = {
                    'type': 'delete_story_chat_event',
                }

                async_to_sync(channel_layer.group_send)(ws_room_name, ws_data)
                async_to_sync(channel_layer.group_send)(
                    ws_chat_room_name, ws_chat_data)

                return DeleteStory(success=True)
            else:
                return DeleteStory(success=False)

        except Story.DoesNotExist:
            return DeleteStory(success=False)


class JoinStory(graphene.Mutation):
    success = graphene.Boolean()
    story = graphene.Field(StoryType)

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            story = Story.objects.get(id=id)
            if story.author != info.context.user and story.users_in_story.count() < story.number_of_users_in_story - 1:
                user = info.context.user
                count_user_male = story.users_in_story.filter(gender=0).count()
                count_user_female = story.users_in_story.filter(
                    gender=1).count()

                if ((user.gender == 0 and count_user_male < story.number_of_users_in_story - 1 - story.female_number) or
                        (user.gender == 1 and count_user_female < story.number_of_users_in_story - 1 - story.male_number)):
                    story.users_in_story.add(user)
                    channel_layer = get_channel_layer()

                    ws_room_name = f'stories_found_{story.language}'
                    ws_chat_room_name = f'story_chat_{story.id}'

                    ws_data = {
                        'type': 'user_join_story_event',
                        'data': {
                            'id': story.id,
                            'is_story_available': story.users_in_story.count() < story.number_of_users_in_story - 1,
                            'user_count': story.users_in_story.count() + 1,
                        }
                    }

                    if ws_data['data']['is_story_available']:
                        ws_data['count_data'] = {
                            'count_female': story.users_in_story.filter(gender=1).count(),
                            'count_male': story.users_in_story.filter(gender=0).count(),
                            'female_number': story.female_number,
                            'male_number': story.male_number,
                            'users_number': story.number_of_users_in_story,
                        }

                    ws_chat_data = {
                        'type': 'join_story_event',
                        'data': {
                            'user': {
                                'id': user.id,
                                'username': user.username,
                                'imageUrl': user.profile_image.url
                            }
                        }
                    }

                    async_to_sync(channel_layer.group_send)(
                        ws_room_name, ws_data)
                    async_to_sync(channel_layer.group_send)(
                        ws_chat_room_name, ws_chat_data)

                    return JoinStory(success=True, story=story)
                else:
                    return JoinStory(success=False)
            else:
                return JoinStory(success=False)
        except Story.DoesNotExist:
            return JoinStory(success=False)


class LeaveStory(graphene.Mutation):
    success = graphene.Boolean()
    story_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @login_required
    def mutate(self, info, id):
        try:
            story = Story.objects.get(id=id)
            is_story_available = story.users_in_story.count() < story.number_of_users_in_story - 1
            user = info.context.user
            is_story_available_data = {
                'author_id': story.author.id,
                'count_female': story.users_in_story.filter(gender=1).count(),
                'count_male': story.users_in_story.filter(gender=0).count(),
                'female_number': story.female_number,
                'male_number': story.male_number,
                'users_number': story.number_of_users_in_story,
            }

            if user in story.users_in_story.all():
                story.users_in_story.remove(user)

                is_story_available_data['count_female_after_leave'] = story.users_in_story.filter(
                    gender=1).count()
                is_story_available_data['count_male_after_leave'] = story.users_in_story.filter(
                    gender=0).count()

                is_story_available_data['users_in_story'] = list(
                    story.users_in_story.values_list('id', flat=True))

                channel_layer = get_channel_layer()

                ws_room_name = f'stories_found_{story.language}'
                ws_chat_room_name = f'story_chat_{story.id}'

                ws_data = {
                    'type': 'user_leave_story_event',
                    'data': {
                        'story': {
                            'id': story.id,
                            'title': story.title,
                            'story': story.plot,
                            'numberOfUsersInStory': story.number_of_users_in_story,
                            'usersCount': story.users_in_story.count() + 1,
                        },
                        'is_story_available': is_story_available,
                    },
                    'is_story_available_data': is_story_available_data
                }

                ws_chat_data = {
                    'type': 'leave_story_event',
                    'data': {
                        'user': {
                            'id': user.id
                        }
                    }
                }

                async_to_sync(channel_layer.group_send)(ws_room_name, ws_data)
                async_to_sync(channel_layer.group_send)(
                    ws_chat_room_name, ws_chat_data)

                return LeaveStory(success=True, story_id=story.id)
            else:
                return LeaveStory(success=False)
        except Story.DoesNotExist:
            return LeaveStory(success=False)


class KickUserFromStory(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        story_id = graphene.ID()
        user_id = graphene.ID()

    @login_required
    def mutate(self, info, story_id, user_id):

        try:
            story = Story.objects.get(id=story_id)
            is_story_available = story.users_in_story.count() < story.number_of_users_in_story - 1

            is_story_available_data = {
                'author_id': story.author.id,
                'count_female': story.users_in_story.filter(gender=1).count(),
                'count_male': story.users_in_story.filter(gender=0).count(),
                'female_number': story.female_number,
                'male_number': story.male_number,
                'users_number': story.number_of_users_in_story,
            }

            if story.author == info.context.user:
                user = User.objects.get(id=user_id)
                story.users_in_story.remove(user)

                is_story_available_data['count_female_after_leave'] = story.users_in_story.filter(
                    gender=1).count()
                is_story_available_data['count_male_after_leave'] = story.users_in_story.filter(
                    gender=0).count()

                is_story_available_data['users_in_story'] = list(
                    story.users_in_story.values_list('id', flat=True))

                channel_layer = get_channel_layer()

                ws_room_name = f'stories_found_{story.language}'
                ws_chat_room_name = f'story_chat_{story.id}'

                ws_data = {
                    'type': 'kick_user_from_story_event',
                    'data': {
                        'story': {
                            'id': story.id,
                            'title': story.title,
                            'story': story.plot,
                            'numberOfUsersInStory': story.number_of_users_in_story,
                            'usersCount': story.users_in_story.count() + 1,
                        },
                        'is_story_available': is_story_available,
                    },
                    'is_story_available_data': is_story_available_data,
                }

                ws_chat_data = {
                    'type': 'kick_user_from_story_chat_event',
                    'data': {
                        'user': {
                            'id': user.id
                        },
                        'story': {
                            'id': story.id
                        }
                    }
                }

                async_to_sync(channel_layer.group_send)(ws_room_name, ws_data)
                async_to_sync(channel_layer.group_send)(
                    ws_chat_room_name, ws_chat_data)

                return KickUserFromStory(success=True)
            else:
                return KickUserFromStory(success=False)
        except (Story.DoesNotExist, User.DoesNotExist):
            return KickUserFromStory(success=False)


class Mutation(graphene.ObjectType):
    create_story = CreateStory.Field()
    delete_story = DeleteStory.Field()
    join_story = JoinStory.Field()
    leave_story = LeaveStory.Field()
    kick_user_from_story = KickUserFromStory.Field()
