import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from urllib.parse import unquote

from .models import Character
from users.models import User


class CharacterType(DjangoObjectType):
    class Meta:
        model = Character

    image_url = graphene.String()

    def resolve_image_url(self, info):
        return self.character_image.url


class Query(graphene.ObjectType):
    character_by_id = graphene.Field(
        CharacterType, id=graphene.ID(required=True))
    characters = graphene.List(CharacterType)
    default_character_image_url = graphene.String()

    @login_required
    def resolve_character_by_id(self, info, id):
        try:
            character = Character.objects.get(id=id)
            if character.user == info.context.user:
                return character
            else:
                return None
        except Character.DoesNotExist:
            return None

    @login_required
    def resolve_characters(self, info, **kwargs):
        return Character.objects.filter(user=info.context.user).order_by('-created_at')

    @login_required
    def resolve_default_character_image_url(self, info, **kwargs):
        return Character.get_default_image_url()


class CreateCharacter(graphene.Mutation):
    character = graphene.Field(CharacterType)

    class Arguments:
        name = graphene.String()
        character_story = graphene.String()
        character_appearance = graphene.String()
        character_trait = graphene.String()

    @login_required
    def mutate(self, info, name, character_story, character_appearance, character_trait):
        user = info.context.user
        files = info.context.FILES
        character = Character(user=user, name=unquote(name.strip()), character_story=unquote(character_story.strip()),
                              character_appearance=unquote(character_appearance.strip()), character_trait=unquote(character_trait.strip()))

        if len(files):
            character.character_image = files['image']

        character.save()
        return CreateCharacter(character=character)


class UpdateCharacter(graphene.Mutation):
    character = graphene.Field(CharacterType)

    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        character_story = graphene.String()
        character_appearance = graphene.String()
        character_trait = graphene.String()
        is_image_delete = graphene.Boolean()

    @login_required
    def mutate(self, info, id, name, character_story, character_appearance, character_trait, is_image_delete):
        try:
            character = Character.objects.get(id=id)
            if character.user == info.context.user:
                if is_image_delete:
                    if character.character_image != 'character_images/avatar.png':
                        character.delete_image()
                else:
                    files = info.context.FILES

                    character.name = unquote(name.strip())
                    character.character_story = unquote(
                        character_story.strip())
                    character.character_appearance = unquote(
                        character_appearance.strip())
                    character.character_trait = unquote(
                        character_trait.strip())

                    if len(files):
                        if character.character_image != 'character_images/avatar.png':
                            character.character_image.delete(save=False)
                        character.character_image = files['image']

                character.save()

                return UpdateCharacter(character=character)
            else:
                return None
        except Character.DoesNotExist:
            return None


class DeleteCharacter(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        try:
            character = Character.objects.get(id=id)
            if character.user == info.context.user:
                if character.character_image != 'character_images/avatar.png':
                    character.character_image.delete(save=False)
                character.delete()
                return DeleteCharacter(success=True)
            else:
                return DeleteCharacter(success=False)
        except Character.DoesNotExist:
            return DeleteCharacter(success=False)


class Mutation(graphene.ObjectType):
    create_character = CreateCharacter.Field()
    update_character = UpdateCharacter.Field()
    delete_character = DeleteCharacter.Field()
