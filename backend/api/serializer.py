from django.contrib.auth.password_validation import validate_password
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

class RegisterSerializer(serializers.ModelSerializer):
    
        password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
        password2 = serializers.CharField(write_only=True, required=True) # for confirm password

        class Meta:
             model = User
             fields = ['full_name', 'email', 'password', 'password2']

        def validate(self, attr):
             if attr['password'] != attr['password2']:
                 raise serializers.ValidationError({"password" : "Password fields didn't match."})
             return attr

        def create(self, validated_data):
             user = User.objects.create(
                  full_name=validated_data['full_name'],
                  email=validated_data['email'],
             )

             email_username, _ = user.email.split("@")
             user.username = email_username
             user.set_password(validated_data['password'])
             user.save()

             return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User # serializer model User with fields describe
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = Profile
        fields = '__all__'   