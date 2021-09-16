import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from urllib.parse import unquote

from .models import UserReport, ErrorReport
from users.models import User


class UserReportType(DjangoObjectType):
    class Meta:
        model = UserReport


class ErrorReportType(DjangoObjectType):
    class Meta:
        model = ErrorReport


class ReportUser(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        reported_user_id = graphene.ID()
        reason = graphene.String()

    @login_required
    def mutate(self, info, reported_user_id, reason):
        try:
            reporting_user = info.context.user
            reported_user = User.objects.get(id=reported_user_id)
            if reporting_user != reported_user:
                user_report = UserReport(
                    reporting_user=reporting_user, reported_user=reported_user, report_reason=reason)
                user_report.save()
                return ReportUser(success=True)
            else:
                return ReportUser(success=False)
        except User.DoesNotExist:
            return ReportUser(success=False)


class ReportError(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        error_description = graphene.String()

    @login_required
    def mutate(self, info, error_description):
        user = info.context.user
        error_report = ErrorReport(
            reporting_user=user, error_description=unquote(error_description))
        error_report.save()
        return ReportError(success=True)


class Mutation(graphene.ObjectType):
    report_user = ReportUser.Field()
    report_error = ReportError.Field()
