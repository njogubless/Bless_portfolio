from django.contrib import admin
from .models import BlogPost, Project, Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'subject', 'sent_at', 'is_read']
    list_filter   = ['is_read']
    readonly_fields = ['name', 'email', 'subject', 'body', 'sent_at']
  
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title','category','published','reading_time', 'created_at',]
    list_filter = ['category', 'published']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['published']

admin.site.register(Project)