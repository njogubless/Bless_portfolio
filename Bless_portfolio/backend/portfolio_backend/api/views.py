import threading

from rest_framework import generics, permissions
from .models import Project, Message , BlogPost
from .serializers import ProjectSerializer, MessageSerializer, BlogPostDetailSerializer, BlogPostListSerializer
from django.core.mail import send_mail

class ProjectListView(generics.ListCreateAPIView):
    queryset         = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.AllowAny]

    def perfom_create(self, serializer):
        instance = serializer.save()
        thread = threading.Thread(target=self._send_notification, args=(instance,))
        thread.daemon = True
        thread.start()

    def _send_notification(self,instance):
        try:
            send_mail(
                subject=f"Portfolio contact: {instance.subject}",
                message=f"From: {instance.name}<{instance.email}>\n\n{instance.body}",
                from_email=['njogubless2@gmail.com'],
                recipient_list=['njogubless2@gmail.com'],
                fail_silently= True,
            )

        except Exception as e:
            print(f"Failed to send email notification: {e}")

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
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = BlogPost.objects.filter(published=True)
    lookup_field = 'slug'