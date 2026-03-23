from django.urls import path
from .views import ProjectListView, MessageCreateView, MessageListView, BlogPostListView, BlogPostDetailView

urlpatterns = [
    path('projects/',  ProjectListView.as_view(),   name='project-list'),
    path('contact/',   MessageCreateView.as_view(),  name='contact'),
    path('messages/',  MessageListView.as_view(),    name='message-list'),
    path('blog/',      BlogPostListView.as_view(),   name='blog-list'),
    path('blog/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
]