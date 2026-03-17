from rest_framework import generics
from .models import Project
from .serializers import ProjectSerializer

# This one view handles GET /api/projects/
# It automatically returns all projects as a JSON list
class ProjectListView(generics.ListAPIView):
    queryset         = Project.objects.all()
    serializer_class = ProjectSerializer