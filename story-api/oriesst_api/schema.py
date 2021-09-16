import graphene
import graphql_jwt
import stories.schema
import users.schema
import characters.schema
import chat.schema
import reports.schema


class Query(users.schema.Query, characters.schema.Query, stories.schema.Query, chat.schema.Query, graphene.ObjectType):
    pass


class Mutation(users.schema.Mutation, characters.schema.Mutation, stories.schema.Mutation, chat.schema.Mutation, reports.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
