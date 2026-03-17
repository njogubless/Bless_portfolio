from django.db import models

class Project(models.Model):
    name        = models.CharField(max_length=100)
    tech        = models.CharField(max_length=200)
    description = models.TextField()
    github_url  = models.URLField(blank=True)
    icon        = models.CharField(max_length=10, default='💻')
    color       = models.CharField(max_length=20, default='purple')
    order       = models.IntegerField(default=0)   # controls display order
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']   # always return projects sorted by order

    def __str__(self):
        return self.name       # shows project name in the admin panel