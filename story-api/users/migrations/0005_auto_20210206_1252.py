# Generated by Django 3.1.3 on 2021-02-06 11:52

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20210206_1226'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(error_messages={'unique': 'A user with that username already exists.'}, max_length=24, unique=True, validators=[users.models.CustomUsernameValidator()]),
        ),
    ]
