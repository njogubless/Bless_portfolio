from django.contrib import admin

from .models import BlogPost, Message, Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ['name', 'tech', 'order', 'created_at']
    list_editable = ['order']
    search_fields = ['name', 'tech']
    ordering      = ['order']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display    = ['name', 'email', 'subject', 'sent_at', 'is_read']
    list_filter     = ['is_read']
    search_fields   = ['name', 'email', 'subject']
    readonly_fields = ['name', 'email', 'subject', 'body', 'sent_at']

    def has_add_permission(self, request):
        # Messages only ever originate from the public contact form.
        return False


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display         = ['title', 'category', 'published', 'reading_time', 'created_at']
    list_filter          = ['category', 'published']
    search_fields        = ['title', 'content']
    prepopulated_fields  = {'slug': ('title',)}
    list_editable        = ['published']
