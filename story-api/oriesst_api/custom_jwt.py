from graphql_jwt.utils import jwt_payload, jwt_decode, get_user_by_natural_key


def custom_jwt_payload(user, context=None):
    payload = jwt_payload(user, context)
    payload['user'] = {
        'id': user.id,
        'username': payload['username'],
        'profile_image': user.profile_image.url,
        'is_banned': user.is_banned(),
        'ban_left_time': user.ban_left_time()
    }
    return payload


def custom_jwt_decode(token, context=None):
    decoded_jwt = jwt_decode(token, context)
    user = get_user_by_natural_key(decoded_jwt['username'])
    decoded_jwt['user']['profile_image'] = user.profile_image.url
    return decoded_jwt
