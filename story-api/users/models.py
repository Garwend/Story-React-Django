from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.conf import settings
from graphql_jwt.refresh_token.models import RefreshToken
from django.db.models import Q
from django.utils import timezone
# Create your models here.


class CustomUsernameValidator(UnicodeUsernameValidator):
    regex = r'^(?!.*\.\.)(?!.*--)(?!.*__)[a-zA-Z0-9]+[a-zA-Z0-9._-]*$'
    message = 'Enter a valid username.'


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)

    username_validator = CustomUsernameValidator()

    username = models.CharField(
        'username',
        max_length=24,
        unique=True,
        validators=[username_validator],
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    email = models.EmailField(
        verbose_name='email address', max_length=255, unique=True)
    profile_image = models.ImageField(
        upload_to='profile_images/', blank=True, null=True, default='profile_images/avatar.png')

    user_bans = models.ManyToManyField('Ban')

    class Gender(models.IntegerChoices):
        MALE = 0
        FEMALE = 1

    gender = models.IntegerField(choices=Gender.choices, default=Gender.MALE)

    def delete_image(self):
        self.profile_image.delete(save=False)
        self.profile_image = 'profile_images/avatar.png'
        self.save()

    def send_mail_with_reset_password_link(self, email):
        token = default_token_generator.make_token(self)
        reset_link = f'http://localhost:3000/#/accounts/reset/password/{self.id}/{token}'

        html_message = render_to_string(
            'users/reset_password_mail.html', {'link': reset_link, 'username': self.username})

        plain_message = strip_tags(html_message)

        send_mail(
            'Oriesst - zresetuj hasło',
            plain_message,
            'no-reply@oriesst.com',
            [email],
            html_message=html_message,
            fail_silently=False,
        )

    def revoke_refresh_tokens(self):
        lookup = (
            Q(user__id=self.id) &
            Q(revoked=None)
        )

        user_refresh_tokens = RefreshToken.objects.filter(lookup)

        for r_token in user_refresh_tokens:
            r_token.revoke()

    def ban_user(self, days_number):
        ban = Ban()
        ban.until = timezone.now() + timezone.timedelta(days=days_number)
        if days_number == 0:
            ban.pernamently = True
        ban.save()
        self.user_bans.add(ban)

    def is_banned(self):
        for ban in self.user_bans.all():
            if timezone.now() < ban.until or ban.pernamently == True:
                return True
        else:
            return False

    def ban_left_time(self):
        left_time_data = {
            'days': 0,
            'hours': 0,
            'minutes': 0,
            'pernamently': False
        }

        for ban in self.user_bans.all():
            if timezone.now() < ban.until or ban.pernamently == True:
                if ban.pernamently == True:
                    left_time_data['pernamently'] = True
                    return left_time_data
                else:
                    left_time = ban.until - timezone.now()
                    days = left_time.days
                    seconds = left_time.seconds
                    hours = seconds//3600
                    minutes = (seconds//60) % 60

                    left_time_data = {
                        'days': days,
                        'hours': hours,
                        'minutes': minutes,
                    }

                    return left_time_data
        else:
            return left_time_data


class Ban(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    pernamently = models.BooleanField(default=False)
    until = models.DateTimeField()
