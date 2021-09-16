from django.db import models
from django.conf import settings

# Create your models here.


class UserReport(models.Model):
    id = models.BigAutoField(primary_key=True)
    report_reason = models.TextField()
    reporting_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reporting_user')
    reported_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_user')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)


class ErrorReport(models.Model):
    id = models.BigAutoField(primary_key=True)
    reporting_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    error_description = models.TextField()
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
