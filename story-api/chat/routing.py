from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/chat/stories/<int:id>',
         consumers.StoryChatConsumer.as_asgi()),
]
