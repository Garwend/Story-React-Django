# Generated by Django 3.1.3 on 2021-03-22 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('characters', '0003_auto_20201223_1618'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='character_image',
            field=models.ImageField(blank=True, default='character_images/avatar.png', null=True, upload_to='character_images/'),
        ),
    ]
