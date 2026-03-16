from django.db import models


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('devops', 'DevOps & Tools'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    level = models.PositiveIntegerField(help_text='Proficiency level 0–100')
    icon = models.CharField(max_length=10, blank=True, help_text='Emoji icon')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['category', 'order', 'name']

    def __str__(self):
        return f'{self.name} ({self.get_category_display()})'


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tech = models.JSONField(default=list, help_text='List of technology names')
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    color = models.CharField(max_length=100, default='from-purple-600 to-indigo-600',
                              help_text='Tailwind gradient classes')
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-featured', 'order', '-created_at']

    def __str__(self):
        return self.title


class Experience(models.Model):
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    period = models.CharField(max_length=100, help_text='e.g. "2023 – Present"')
    description = models.TextField()
    highlights = models.JSONField(default=list, help_text='List of highlight strings')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.role} at {self.company}'


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.created_at.strftime("%Y-%m-%d")}] {self.name}: {self.subject}'
