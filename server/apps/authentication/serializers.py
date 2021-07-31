from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    admin = serializers.SerializerMethodField()
    paid = serializers.BooleanField()

    def get_admin(self, obj):
        return obj.is_staff


class UserDetailSerializer(UserSerializer):
    created = serializers.DateTimeField(source='date_joined')
