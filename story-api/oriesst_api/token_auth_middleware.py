from asgiref.sync import sync_to_async
from graphql_jwt.utils import jwt_decode, get_user_by_payload
from django.contrib.auth.models import AnonymousUser


class TokenAuthMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        print(headers)
        if b'cookie' in headers:
            cookies = headers[b'cookie'].decode("utf-8")
            cookies = dict(cookie.split('=', 1)
                           for cookie in cookies.split('; '))
            try:
                payload = jwt_decode(cookies['JWT'])
                get_user = sync_to_async(get_user_by_payload)(payload)
                scope['user'] = await get_user
            except KeyError:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)
