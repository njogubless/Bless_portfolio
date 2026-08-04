import logging

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from rest_framework import generics, permissions
from rest_framework.throttling import ScopedRateThrottle

from .models import BlogPost, Message, Project
from .pagination import MessagePagination
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    MessageSerializer,
    ProjectSerializer,
)

logger = logging.getLogger(__name__)


class ProjectListView(generics.ListCreateAPIView):
    """Portfolio projects. Readable by anyone; only admins can add new ones."""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class MessageCreateView(generics.CreateAPIView):
    """Public contact-form submission. Rate-limited to deter spam/abuse."""

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'

    def perform_create(self, serializer):
        instance = serializer.save()
        # Defer the notification until the surrounding transaction actually
        # commits, so we never email about a message a later error rolls back.
        transaction.on_commit(lambda: self._send_notification(instance))

    @staticmethod
    def _send_notification(instance):
        try:
            sent = send_mail(
                subject=f"Portfolio contact: {instance.subject}",
                message=f"From: {instance.name} <{instance.email}>\n\n{instance.body}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_NOTIFICATION_EMAIL],
                fail_silently=True,
            )
        except Exception:
            # fail_silently only swallows SMTP-level errors; guard against
            # anything else (bad settings, etc.) so a broken mail config
            # can never take the contact form down with it.
            logger.exception(
                "Unexpected error sending contact notification for message id=%s",
                instance.pk,
            )
            return

        if not sent:
            # fail_silently=True means SMTP failures return 0 instead of
            # raising — log it, otherwise notification failures are
            # completely invisible.
            logger.warning(
                "Contact notification email for message id=%s was not sent (SMTP failure).",
                instance.pk,
            )


class MessageListView(generics.ListAPIView):
    """Contact messages contain personal data — admin-only, never public."""

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = MessagePagination


class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BlogPost.objects.filter(published=True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class BlogPostDetailView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = BlogPost.objects.filter(published=True)
    lookup_field = 'slug'
