from rest_framework import serializers
from .models import Project

# A serializer converts a Python object (your Project model)
# into JSON that React can read — and vice versa
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = ['id', 'name', 'tech', 'description', 'github_url', 'icon', 'color', 'order', 'created_at']