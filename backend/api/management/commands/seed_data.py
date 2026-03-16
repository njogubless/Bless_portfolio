"""
Management command to populate the database with sample portfolio data.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from api.models import Skill, Project, Experience


class Command(BaseCommand):
    help = 'Seed the database with sample portfolio data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding portfolio data...')

        # Skills
        Skill.objects.all().delete()
        skills = [
            # Frontend
            ('React.js', 'frontend', 90, '', 1),
            ('TypeScript', 'frontend', 82, '', 2),
            ('Tailwind CSS', 'frontend', 88, '', 3),
            ('Next.js', 'frontend', 78, '', 4),
            ('Framer Motion', 'frontend', 75, '', 5),
            # Backend
            ('Django', 'backend', 88, '', 1),
            ('Python', 'backend', 85, '', 2),
            ('Django REST Framework', 'backend', 85, '', 3),
            ('Node.js', 'backend', 72, '', 4),
            ('PostgreSQL', 'backend', 80, '', 5),
            # DevOps
            ('Git & GitHub', 'devops', 90, '', 1),
            ('Docker', 'devops', 70, '', 2),
            ('Linux/Bash', 'devops', 75, '', 3),
            ('REST APIs', 'devops', 92, '', 4),
            ('CI/CD', 'devops', 68, '', 5),
        ]
        for name, cat, level, icon, order in skills:
            Skill.objects.create(name=name, category=cat, level=level, icon=icon, order=order)

        # Projects
        Project.objects.all().delete()
        projects = [
            {
                'title': 'E-Commerce Platform',
                'description': 'A full-stack e-commerce platform with React frontend and Django backend. Features real-time inventory management, payment integration, and a beautiful admin dashboard.',
                'tech': ['React', 'Django', 'PostgreSQL', 'Stripe', 'Docker'],
                'github_url': 'https://github.com/njogubless/ecommerce',
                'color': 'from-purple-600 to-indigo-600',
                'featured': True,
                'order': 1,
            },
            {
                'title': 'Task Management App',
                'description': 'A Kanban-style task management application with real-time collaboration.',
                'tech': ['React', 'Django Channels', 'WebSockets', 'Redux'],
                'github_url': 'https://github.com/njogubless/taskmanager',
                'color': 'from-violet-600 to-purple-600',
                'featured': True,
                'order': 2,
            },
            {
                'title': 'AI Blog Generator',
                'description': 'Leveraging OpenAI\'s API to auto-generate blog content.',
                'tech': ['React', 'Python', 'OpenAI API', 'FastAPI'],
                'github_url': 'https://github.com/njogubless/ai-blog',
                'color': 'from-fuchsia-600 to-violet-600',
                'featured': False,
                'order': 3,
            },
        ]
        for p in projects:
            Project.objects.create(**p)

        # Experience
        Experience.objects.all().delete()
        experiences = [
            {
                'role': 'Full Stack Developer',
                'company': 'TechNairobi Solutions',
                'period': '2023 – Present',
                'description': 'Lead development of client-facing web applications using React and Django.',
                'highlights': [
                    'Reduced page load time by 60% through code splitting',
                    'Built real-time notifications with Django Channels',
                    'Implemented CI/CD pipelines with GitHub Actions',
                ],
                'order': 1,
            },
            {
                'role': 'Frontend Developer',
                'company': 'Digital Creatives KE',
                'period': '2022 – 2023',
                'description': 'Developed responsive UIs for fintech startups.',
                'highlights': [
                    'Delivered 8+ client projects on time',
                    'Introduced Tailwind CSS across the team',
                    'Built a shared component library',
                ],
                'order': 2,
            },
            {
                'role': 'Junior Developer',
                'company': 'Freelance',
                'period': '2021 – 2022',
                'description': 'Built online presence for local businesses.',
                'highlights': [
                    'Built 15+ client websites and apps',
                    'Rebuilt a PHP CMS in Django',
                    'Maintained 5 long-term client relationships',
                ],
                'order': 3,
            },
        ]
        for e in experiences:
            Experience.objects.create(**e)

        self.stdout.write(self.style.SUCCESS('✓ Database seeded successfully!'))
