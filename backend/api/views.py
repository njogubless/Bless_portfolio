from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Skill, Project, Experience, ContactMessage
from .serializers import (
    SkillSerializer, ProjectSerializer,
    ExperienceSerializer, ContactMessageSerializer,
)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve skills."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve projects."""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Return only featured projects."""
        qs = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve experience entries."""
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.AllowAny]


class ContactMessageViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """Accept contact form submissions (POST only)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'detail': 'Your message has been received. I\'ll be in touch soon!'},
            status=status.HTTP_201_CREATED,
        )
