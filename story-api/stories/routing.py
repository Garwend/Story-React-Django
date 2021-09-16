from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/found/stories/<str:language>',
         consumers.StoriesFoundConsumer.as_asgi()),
]
