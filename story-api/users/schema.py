import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from graphql_jwt.refresh_token.models import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User

    image_url = graphene.String()

    def resolve_image_url(self, info):
        return self.profile_image.url


class Query(graphene.ObjectType):
    user_by_username = graphene.Field(UserType, username=graphene.String())
    users = graphene.List(UserType)

    @login_required
    def resolve_user_by_username(self, info, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    @login_required
    def resolve_users(self, info):
        return User.objects.all()


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    validation_error = graphene.JSONString()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        gender = graphene.Int(required=True)

    def mutate(self, info, username, password, email, gender):
        try:
            user = User(username=username.lower(), email=email, gender=gender)
            validate_password(password)
            user.set_password(password)
            user.full_clean()
            user.save()
            return CreateUser(success=True, user=user)
        except ValidationError as e:
            return CreateUser(success=False, validation_error=e.message_dict)


class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user
        files = info.context.FILES

        if len(files):
            if user.profile_image != 'profile_images/avatar.png':
                user.profile_image.delete(save=False)
            user.profile_image = files['image']
        else:
            user.delete_image()

        user.save()

        return UpdateUser(user=user)


class ChangePassword(graphene.Mutation):
    success = graphene.Boolean()
    wrong_password = graphene.Boolean()

    class Arguments:
        password = graphene.String()
        new_password = graphene.String()
        new_password2 = graphene.String()

    def mutate(self, info, password, new_password, new_password2):
        user = info.context.user

        if user.check_password(password):
            if new_password == new_password2:
                user.set_password(new_password)
                user.save()
                user.revoke_refresh_tokens()
                return ChangePassword(success=True)
            else:
                return ChangePassword(success=False)
        else:
            return ChangePassword(success=False, wrong_password=True)


class ForgotPassword(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        email = graphene.String(required=True)

    def mutate(self, info, email):
        try:
            user = User.objects.get(email=email)
            user.send_mail_with_reset_password_link(email)
            return ForgotPassword(success=True)
        except User.DoesNotExist:
            return ForgotPassword(success=False)


class CheckResetPasswordToken(graphene.Mutation):
    valid = graphene.Boolean()

    class Arguments:
        uid = graphene.ID()
        token = graphene.String()

    def mutate(self, info, uid, token):
        try:
            user = User.objects.get(id=uid)
            return CheckResetPasswordToken(valid=default_token_generator.check_token(user, token))
        except User.DoesNotExist:
            return CheckResetPasswordToken(valid=False)


class ResetPassword(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        uid = graphene.ID()
        token = graphene.String()
        password = graphene.String()
        password2 = graphene.String()

    def mutate(self, info, uid, token, password, password2):
        try:
            user = User.objects.get(id=uid)
            if password == password2 and default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                user.revoke_refresh_tokens()
                return ResetPassword(success=True)
            else:
                return ResetPassword(success=False)

        except User.DoesNotExist:
            return ResetPassword(success=False)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    change_password = ChangePassword.Field()
    forgot_password = ForgotPassword.Field()
    check_reset_password_token = CheckResetPasswordToken.Field()
    reset_password = ResetPassword.Field()
