from django.db import models
from django.conf import settings
from django.db.models import Q, F, Count
from characters.models import Character
# Create your models here.


class StoryQuerySet(models.QuerySet):
    def user_stories(self, user):
        lookup = (
            Q(author=user) |
            Q(users_in_story__id=user.id)
        )

        return self.filter(lookup).distinct()

    def stories_found(self, user, language):
        filter_lookup = ()

        if user.gender == 0:
            filter_lookup = (
                Q(language=language) &
                Q(num_users__lt=F('number_of_users_in_story') - 1) &
                Q(num_users_male__lt=F('number_of_users_in_story') -
                  1 - F('female_number'))
            )
        elif user.gender == 1:
            filter_lookup = (
                Q(language=language) &
                Q(num_users__lt=F('number_of_users_in_story') - 1) &
                Q(num_users_female__lt=F(
                    'number_of_users_in_story') - 1 - F('male_number'))
            )

        exclude_lookup = (
            Q(author=user) |
            Q(users_in_story__id=user.id)
        )

        count_user_male = Count(
            'users_in_story', filter=Q(users_in_story__gender=0))
        count_user_female = Count(
            'users_in_story', filter=Q(users_in_story__gender=1))

        return self.annotate(num_users=Count('users_in_story'), num_users_male=count_user_male, num_users_female=count_user_female).filter(filter_lookup).exclude(exclude_lookup).order_by('-created_at')


class StoryManager(models.Manager):
    def get_queryset(self):
        return StoryQuerySet(self.model, using=self._db)

    def stories_found(self, user, language):
        return self.get_queryset().stories_found(user, language)

    def user_stories(self, user):
        return self.get_queryset().user_stories(user)


class Story(models.Model):
    id = models.BigAutoField(primary_key=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    plot = models.TextField()

    class NumberOfUsersInStory(models.IntegerChoices):
        TWO = 2
        THREE = 3
        FOUR = 4
        FIVE = 5

    number_of_users_in_story = models.IntegerField(
        choices=NumberOfUsersInStory.choices, default=NumberOfUsersInStory.TWO)

    male_number = models.IntegerField(default=0)
    female_number = models.IntegerField(default=0)

    class Language(models.TextChoices):
        POLISH = 'PL'
        ENGLISH = 'EN'
        GERMAN = 'DE'

    language = models.CharField(
        choices=Language.choices,
        default=Language.ENGLISH,
        max_length=3)

    users_in_story = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='users_in_story')
    additional_characters = models.ManyToManyField(Character)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)

    objects = StoryManager()
