from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

# Create your custom models here.

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    otp = models.CharField(max_length=100, unique=True)

    USERNAME_FIELD = "email" # place email for login username instead
    REQUIRED_FIELDS = ["username"] # required fields for creating a user

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs): # accept arguments and kword arguments from request
        email_username, full_name = self.email.split("@")
        if self.full_name == "" or self.full_name == None:
            self.full_name = email_username
        if self.username == "" or self.username == None:
            self.username = email_username    
        super(User, self).save(*args, **kwargs)

class Profile(models.Model): # profile model keeps core user info
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile") # del profile if user get deleted
    image = models.FileField(upload_to="user_folder", default="default-user.jpg", null=True, blank=True)
    full_name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.full_name)
        
    def save(self, *args, **kwargs): # accept arguments and kword arguments from request
        if self.full_name == "" or self.full_name == None:
            self.full_name = self.user.username
        super(Profile, self).save(*args, **kwargs)    

        # install models in admin section


def create_user_profile(sender, instance, created, **kwargs):
    if created: # if user created will be created new profile
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
# when User model get saved will trigger create_user_profile