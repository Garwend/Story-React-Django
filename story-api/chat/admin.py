from django.contrib import admin
from .models import Message
import json
# Register your models here.


class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'message', 'created_at', 'user', 'story')
    search_fields = ['user__id__exact']

    def message(self, obj):
        message_json = json.loads('[' + obj.text + ']')
        new_message = [value for m in message_json for key,
                       value in m.items() if key == 'messagePart']

        return ' '.join(new_message)


admin.site.register(Message, MessageAdmin)
