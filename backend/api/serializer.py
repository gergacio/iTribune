from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from userauths.models import User, Profile

class MyTokenObtainSerializer(TokenObtainPairSerializer): # class create new token serializer based on existen one which we imported
    @classmethod # fn belongs to class itself
    def get_token(cls, user):
        token = super().get_token(user) # user in someone try to access web site
        # customize token adding extra info
        token['full_name'] = user.full_name # grab it from the models
        token['email'] = user.email
        token['username'] = user.username

        return token

class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User # serializer model User with fields describe
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = Profile
        fields = '__all__'   