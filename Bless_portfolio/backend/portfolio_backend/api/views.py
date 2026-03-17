from rest_framework import viewsets, serializers
from .models import Project, Experience

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all().order_by('order')
    serializer_class = ProjectSerializer
