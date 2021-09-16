from django.db import models
from django.conf import settings
from stories.models import Story
from characters.models import Character
# Create your models here.


class Message(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    character = models.ForeignKey(
        Character, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
