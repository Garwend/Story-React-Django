import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import json
from urllib.parse import unquote

from .models import Message
from stories.models import Story
from characters.models import Character


class MessageType(DjangoObjectType):
    class Meta:
        model = Message

    user_is_author = graphene.Boolean()

    def resolve_user_is_author(self, info):
        if self.user == info.context.user:
            return True
        else:
            return False


class Query(graphene.ObjectType):
    messages = graphene.List(MessageType, story_id=graphene.ID(
        required=True), last_id=graphene.ID(required=False))

    @login_required
    def resolve_messages(self, info, story_id, last_id=None):
        try:
            story = Story.objects.get(id=story_id)
            user = info.context.user
            if user == story.author or user in story.users_in_story.all():
                if last_id != None:
                    messages = Message.objects.filter(
                        story=story, id__lt=last_id).order_by('-created_at')[0:16]
                else:
                    messages = Message.objects.filter(
                        story=story).order_by('-created_at')[0:16]
                return messages
            else:
                return None
        except Story.DoesNotExist:
            return None


class CreateMessage(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        text = graphene.String(required=True)
        story_id = graphene.ID(required=True)
        character_id = graphene.ID(required=False)

    @login_required
    def mutate(self, info, text, story_id, character_id=None):
        try:
            def format_text(text):
                return json.dumps({'messagePart': unquote(text['messagePart']), 'messageType': text['messageType']})

            text_json = json.loads(text)
            text_json = list(map(format_text, text_json['message']))
            text_json = ",".join(text_json)

            user = info.context.user
            story = Story.objects.get(id=story_id)
            message = Message(user=user, story=story, text=text_json)
            if character_id != None:
                character = Character.objects.get(id=character_id)
                message.character = character

            if user == story.author or user in story.users_in_story.all():
                message.save()

                channel_layer = get_channel_layer()

                ws_room_name = f'story_chat_{story.id}'

                ws_data = {
                    'type': 'send_story_chat_message_event',
                    'data': {
                        'id': message.id,
                        'text': text_json,
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'imageUrl': user.profile_image.url,
                        },
                        'createdAt': str(message.created_at),
                        'character': None,
                    }
                }

                if character_id != None:
                    ws_data['data']['character'] = {
                        'id': message.character.id,
                        'name': message.character.name,
                        'imageUrl': message.character.character_image.url,
                    }

                async_to_sync(channel_layer.group_send)(ws_room_name, ws_data)

                return CreateMessage(success=True)
            else:
                return CreateMessage(success=False)
        except (Story.DoesNotExist, Character.DoesNotExist):
            return CreateMessage(success=False)


class Mutation(graphene.ObjectType):
    create_message = CreateMessage.Field()
