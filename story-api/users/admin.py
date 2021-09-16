from django.contrib import admin
from .models import User
# Register your models here.


def ban_user_3_days(modeladmin, request, queryset):
    for user in queryset:
        user.ban_user(3)


def ban_user_7_days(modeladmin, request, queryset):
    for user in queryset:
        user.ban_user(7)


def ban_user_14_days(modeladmin, request, queryset):
    for user in queryset:
        user.ban_user(14)


def ban_user_30_days(modeladmin, request, queryset):
    for user in queryset:
        user.ban_user(30)


def ban_user_pernamently(modeladmin, request, queryset):
    for user in queryset:
        user.ban_user(0)


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_banned')
    readonly_fields = ['id', 'username', 'password']
    search_fields = ['id__exact']

    actions = [ban_user_3_days, ban_user_7_days,
               ban_user_14_days, ban_user_30_days, ban_user_pernamently]

    def is_banned(self, obj):
        return obj.is_banned()


admin.site.register(User, UserAdmin)
