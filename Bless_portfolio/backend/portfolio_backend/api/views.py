from rest_framework import generics, permissions
from .models import Project, Message , BlogPost
from .serializers import ProjectSerializer, MessageSerializer, BlogPostDetailSerializer, BlogPostListSerializer

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
   
    permission_classes = [permissions.AllowAny]


class MessageListView(generics.ListAPIView):
    queryset         = Message.objects.all()
    serializer_class = MessageSerializer

    permission_classes = [permissions.IsAuthenticated]


class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    permission_classes = [permissions.AllowAny]


    def get_queryset(self):
        queryset = BlogPost.objects.filter(published = True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class BlogPostDetailView(generics.RetrieveAPIView):
    serialzer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = BlogPost.objects.filter(published=True)
    lookup_field = 'slug'