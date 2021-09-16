from django.db import models
from django.conf import settings
from django.core.files.storage import get_storage_class
# Create your models here.


class Character(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    character_image = models.ImageField(
        upload_to='character_images/', blank=True, null=True, default='character_images/avatar.png')
    name = models.CharField(max_length=24)
    character_story = models.TextField(blank=True)
    character_appearance = models.TextField()
    character_trait = models.TextField()
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)

    def delete_image(self):
        self.character_image.delete(save=False)
        self.character_image = 'character_images/avatar.png'
        self.save()

    @staticmethod
    def get_default_image_url():
        media_storage = get_storage_class()()
        default_image_url = media_storage.url(
            name='character_images/avatar.png')
        return default_image_url
