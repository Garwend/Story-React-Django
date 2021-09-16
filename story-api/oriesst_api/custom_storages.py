from storages.backends.s3boto3 import S3Boto3Storage


class DjangoStaticStorage(S3Boto3Storage):
    location = 'django_static'
