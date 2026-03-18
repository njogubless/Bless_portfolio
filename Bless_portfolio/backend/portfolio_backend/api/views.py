from rest_framework import generics, permissions
from .models import Project, Message
from .serializers import ProjectSerializer, MessageSerializer

class ProjectListView(generics.ListCreateAPIView):
    queryset         = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class MessageCreateView(generics.CreateAPIView):
    queryset         = Message.objects.all()
    serializer_class = MessageSerializer
    # Anyone can POST a message (visitors sending you contact form)
    permission_classes = [permissions.AllowAny]


class MessageListView(generics.ListAPIView):
    queryset         = Message.objects.all()
    serializer_class = MessageSerializer
    # Only YOU can read the inbox — must be logged in
    permission_classes = [permissions.IsAuthenticated]