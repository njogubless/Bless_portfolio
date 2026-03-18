#from email.message import Message

from rest_framework import serializers
from .models import Project, Message

# A serializer converts a Python object (your Project model)
# into JSON that React can read — and vice versa
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = ['id', 'name', 'tech', 'description', 'github_url', 'icon', 'color', 'order', 'created_at']



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Message
        fields = ['id', 'name', 'email', 'subject', 'body', 'sent_at']