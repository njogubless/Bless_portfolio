

from rest_framework import serializers
from .models import BlogPost, Project, Message


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = ['id', 'name', 'tech', 'description', 'github_url', 'icon', 'color', 'order', 'created_at']



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Message
        fields = ['id', 'name', 'email', 'subject', 'body', 'sent_at']


class BlogPostListSerializer(serializers.ModelSerializer):
    reading_time = serializers.ReadOnlyField()
    tags_list = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields =[
            'id', 'title', 'slug', 'excerpt',
            'catergory', 'tags_list', 'cover',
            'reading_time','created_at',
        ]
 
class BlogPostDetailSerializer(serializers.ModelSerializer):
    reading_time = serializers.ReadOnlyField()
    tags_list = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields =[
            'id', 'title', 'slug', 'excerpt',
            'content', 'catergory', 'tags_list',
            'cover', 'reading_time','created_at',
        ]