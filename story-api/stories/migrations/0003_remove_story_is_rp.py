# Generated by Django 3.1.3 on 2021-01-22 15:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_story_additional_characters'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='story',
            name='is_rp',
        ),
    ]
