from django.contrib import admin
from .models import UserReport, ErrorReport
import json
# Register your models here.


class UserReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'reported_user', 'report_reason')


class ErrorReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'reporting_user', 'error_description')


admin.site.register(UserReport, UserReportAdmin)
admin.site.register(ErrorReport, ErrorReportAdmin)
