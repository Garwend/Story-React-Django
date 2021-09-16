import json

from channels.generic.websocket import AsyncWebsocketConsumer


class StoryChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        story_id = self.scope['url_route']['kwargs']['id']
        self.room_group_name = f'story_chat_{story_id}'

        user = self.scope['user']

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'join_story_chat_event',
            }
        )

    async def disconnect(self, close_code):
        print(f'disconnect {close_code}')

        user = self.scope['user']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'leave_story_chat_event',
                'data': {
                    'user': {
                        'id': user.id,
                    }
                }
            }
        )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        message = json.loads(text_data)

        if message['message_type'] == 'check_if_user_is_connected':
            user = self.scope['user']
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_is_connected_event',
                    'data': {
                        'user': {
                            'id': user.id,
                        }
                    }
                }
            )
        elif message['message_type'] == 'user_reconnect':

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'join_story_chat_event',
                }
            )

    async def join_story_event(self, event):
        data = event['data']

        await self.send(json.dumps({
            'message_type': 'user_join_story',
            'data': data
        }))

    async def leave_story_event(self, event):
        data = event['data']

        await self.send(json.dumps({
            'message_type': 'user_leave_story',
            'data': data
        }))

    async def join_story_chat_event(self, event):

        await self.send(json.dumps({
            'message_type': 'user_join_story_chat',
        }))

    async def leave_story_chat_event(self, event):
        data = event['data']

        await self.send(json.dumps({
            'message_type': 'user_leave_story_chat',
            'data': data
        }))

    async def send_story_chat_message_event(self, event):
        data = event['data']
        data['userIsAuthor'] = data['user']['id'] == self.scope['user'].id

        await self.send(json.dumps({
            'message_type': 'chat_message',
            'data': data
        }))

    async def user_is_connected_event(self, event):
        data = event['data']

        await self.send(json.dumps({
            'message_type': 'user_is_connected',
            'data': data
        }))

    async def delete_story_chat_event(self, event):

        await self.send(json.dumps({
            'message_type': 'delete_story',
        }))

    async def kick_user_from_story_chat_event(self, event):
        data = event['data']
        data['user_is_kicked'] = data['user']['id'] == self.scope['user'].id
        await self.send(json.dumps({
            'message_type': 'kick_user_from_story_chat',
            'data': data
        }))
