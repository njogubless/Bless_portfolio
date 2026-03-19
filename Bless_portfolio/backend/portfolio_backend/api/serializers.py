

from rest_framework import serializers
from .models import Project, Message


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = ['id', 'name', 'tech', 'description', 'github_url', 'icon', 'color', 'order', 'created_at']



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Message
        fields = ['id', 'name', 'email', 'subject', 'body', 'sent_at']