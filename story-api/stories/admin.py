from django.contrib import admin
from .models import Story
# Register your models here.


class StoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at', 'author')
    search_fields = ['id__exact']


admin.site.register(Story, StoryAdmin)
