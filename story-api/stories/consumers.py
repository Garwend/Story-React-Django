import json

from channels.generic.websocket import AsyncWebsocketConsumer


class StoriesFoundConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        language = self.scope['url_route']['kwargs']['language']
        self.room_group_name = f'stories_found_{language}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        print(f'disconnect {close_code}')

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def add_story_event(self, event):
        data = event['data']
        user = self.scope['user']
        is_story_available_data = event['is_story_available_data']
        number_of_users_in_story = data['numberOfUsersInStory']
        male_number = is_story_available_data['male_number']
        female_number = is_story_available_data['female_number']

        if ((user.gender == 0 and number_of_users_in_story - 1 - female_number > 0) or
                (user.gender == 1 and number_of_users_in_story - 1 - male_number > 0)):

            await self.send(json.dumps({
                'message_type': 'add_story',
                'data': data
            }))

    async def delete_story_event(self, event):
        data = event['data']

        await self.send(json.dumps({
            'message_type': 'delete_story',
            'data': data
        }))

    async def user_join_story_event(self, event):
        data = event['data']
        user = self.scope['user']

        if data['is_story_available']:
            count_data = event['count_data']
            users_number = count_data['users_number']
            count_male = count_data['count_male']
            count_female = count_data['count_female']

            if ((user.gender == 0 and count_male >= users_number - 1 - count_data['female_number']) or
                    (user.gender == 1 and count_female >= users_number - 1 - count_data['male_number'])):

                data['is_story_available'] = False

        await self.send(json.dumps({
            'message_type': 'user_join_story',
            'data': data
        }))

    async def user_leave_story_event(self, event):
        user = self.scope['user']
        is_story_available_data = event['is_story_available_data']

        if is_story_available_data['author_id'] != user.id and user.id not in is_story_available_data['users_in_story']:
            data = event['data']

            users_number = is_story_available_data['users_number']
            male_number = is_story_available_data['male_number']
            female_number = is_story_available_data['female_number']

            count_male = is_story_available_data['count_male']
            count_female = is_story_available_data['count_female']

            count_male_after_leave = is_story_available_data['count_male_after_leave']
            count_female_after_leave = is_story_available_data['count_female_after_leave']

            if ((user.gender == 0 and count_male < users_number - 1 - female_number) or
                    (user.gender == 1 and count_female < users_number - 1 - male_number)):

                await self.send(json.dumps({
                    'message_type': 'user_leave_story',
                    'data': data
                }))

            elif ((user.gender == 0 and count_male_after_leave < users_number - 1 - female_number) or
                  (user.gender == 1 and count_female_after_leave < users_number - 1 - male_number)):

                data['is_story_available'] = False

                await self.send(json.dumps({
                    'message_type': 'user_leave_story',
                    'data': data
                }))

    async def kick_user_from_story_event(self, event):
        user = self.scope['user']
        is_story_available_data = event['is_story_available_data']

        if is_story_available_data['author_id'] != user.id and user.id not in is_story_available_data['users_in_story']:
            data = event['data']

            users_number = is_story_available_data['users_number']
            male_number = is_story_available_data['male_number']
            female_number = is_story_available_data['female_number']

            count_male = is_story_available_data['count_male']
            count_female = is_story_available_data['count_female']

            count_male_after_leave = is_story_available_data['count_male_after_leave']
            count_female_after_leave = is_story_available_data['count_female_after_leave']

            if ((user.gender == 0 and count_male < users_number - 1 - female_number) or
                    (user.gender == 1 and count_female < users_number - 1 - male_number)):

                await self.send(json.dumps({
                    'message_type': 'kick_user_from_story',
                    'data': data
                }))

            elif ((user.gender == 0 and count_male_after_leave < users_number - 1 - female_number) or
                  (user.gender == 1 and count_female_after_leave < users_number - 1 - male_number)):

                data['is_story_available'] = False

                await self.send(json.dumps({
                    'message_type': 'kick_user_from_story',
                    'data': data
                }))
