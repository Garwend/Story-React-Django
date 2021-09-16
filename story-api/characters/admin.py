from django.contrib import admin
from .models import Character
# Register your models here.


class CharacterAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'user')
    search_fields = ['id__exact']


admin.site.register(Character, CharacterAdmin)
