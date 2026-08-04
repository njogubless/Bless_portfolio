from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from .models import BlogPost, Message, Project


class ProjectAPITest(TestCase):

    def setUp(self):

        self.client = APIClient()
        Project.objects.create(
            name='Test Project',
            tech='Flutter · Firebase',
            description='A test project',
            github_url='https://github.com/test',
            icon='🏔',
            color='purple',
            order=1,
        )

    def test_projects_endpoint_is_public(self):

        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, 200)

    def test_projects_returns_list(self):

        response = self.client.get('/api/projects/')
        self.assertIsInstance(response.data, list)

    def test_projects_returns_correct_fields(self):

        response = self.client.get('/api/projects/')
        project = response.data[0]
        self.assertIn('name', project)
        self.assertIn('tech', project)
        self.assertIn('description', project)
        self.assertIn('github_url', project)


class ContactAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_contact_endpoint_accepts_post(self):

        response = self.client.post(
            '/api/contact/',
            {
                'name':    'Test User',
                'email':   'test@gmail.com',
                'subject': 'Test Subject',
                'body':    'This is a test message body here',
            },
            format='json'
        )
        self.assertEqual(response.status_code, 201)

    def test_contact_saves_to_database(self):

        self.client.post(
            '/api/contact/',
            {
                'name':    'Caleb',
                'email':   'caleb@gmail.com',
                'subject': 'Hello',
                'body':    'Reaching out about a project',
            },
            format='json'
        )
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.first().name, 'Caleb')

    def test_contact_rejects_invalid_email(self):

        response = self.client.post(
            '/api/contact/',
            {
                'name':    'Test',
                'email':   'not-an-email',
                'subject': 'Test',
                'body':    'Test message body here',
            },
            format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_messages_endpoint_is_protected(self):

        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 401)

    def test_notification_email_sent_on_contact(self):
        # The email fires from a transaction.on_commit callback. patch() has to stay
        # active until that callback actually runs, so captureOnCommitCallbacks (which
        # runs it synchronously at the end of its own block) must be the inner context —
        # otherwise the mock is already undone by the time the callback fires.
        with patch('api.views.send_mail') as mock_send_mail:
            mock_send_mail.return_value = 1
            with self.captureOnCommitCallbacks(execute=True):
                response = self.client.post(
                    '/api/contact/',
                    {
                        'name':    'Jane',
                        'email':   'jane@example.com',
                        'subject': 'Hi there',
                        'body':    'Let us build something together',
                    },
                    format='json'
                )

        self.assertEqual(response.status_code, 201)
        mock_send_mail.assert_called_once()
        _, kwargs = mock_send_mail.call_args
        # Regression check: from_email must be a plain string, not a list —
        # Django's send_mail() mishandles a list here.
        self.assertIsInstance(kwargs['from_email'], str)
        self.assertIsInstance(kwargs['recipient_list'], list)


class MessageListPermissionTest(TestCase):
    """Contact messages carry personal data — only admins may list them."""

    def setUp(self):
        self.client = APIClient()
        Message.objects.create(
            name='Someone', email='someone@example.com',
            subject='Hi', body='Test message body',
        )

    def test_anonymous_is_rejected(self):
        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 401)

    def test_authenticated_non_admin_is_forbidden(self):
        user = User.objects.create_user(username='regular', password='pw12345')
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 403)

    def test_admin_can_list_messages(self):
        admin = User.objects.create_user(username='admin', password='pw12345', is_staff=True)
        self.client.force_authenticate(user=admin)
        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 200)


class ProjectWriteProtectionTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.payload = {
            'name': 'Fake Project',
            'tech': 'React',
            'description': 'Injected project',
            'icon': '💀',
            'color': 'red',
            'order': 99,
        }

    def test_cannot_post_project_without_token(self):

        response = self.client.post('/api/projects/', self.payload, format='json')
        self.assertEqual(response.status_code, 401)

    def test_authenticated_non_admin_cannot_post_project(self):
        user = User.objects.create_user(username='regular', password='pw12345')
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/projects/', self.payload, format='json')
        self.assertEqual(response.status_code, 403)

    def test_admin_can_post_project(self):
        admin = User.objects.create_user(username='admin', password='pw12345', is_staff=True)
        self.client.force_authenticate(user=admin)
        response = self.client.post('/api/projects/', self.payload, format='json')
        self.assertEqual(response.status_code, 201)


class BlogAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        BlogPost.objects.create(
            title='How Hikers Afrique was built and the stack behind it',
            slug='hikers-afrique-stack',
            excerpt='A detailed look into the tech stack and architecture of Hikers Afrique, '
                    'a mobile app built with Flutter and Firebase.',
            content='Hikers Afrique is a mobile app designed to connect hikers across the '
                     'African continent, providing a platform for sharing trails, tips, and '
                     'experiences. The app was built using Flutter for the frontend and '
                     'Firebase for the backend, leveraging the strengths of both technologies '
                     'to create a seamless user experience.',
            category='mobile',
            tags='Flutter, Firebase, Dart',
            published=True,
        )
        BlogPost.objects.create(
            title='Draft post',
            slug='draft-post',
            excerpt='This is a draft post that should not appear in the public API.',
            content='Draft content',
            category='career',
            published=False,
        )

    def test_blog_list_returns_only_published(self):
        response = self.client.get('/api/blog/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_blog_detail_by_slug(self):
        response = self.client.get('/api/blog/hikers-afrique-stack/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'How Hikers Afrique was built and the stack behind it')

    def test_nonexistent_slug_returns_404(self):
        response = self.client.get('/api/blog/does-not-exist/')
        self.assertEqual(response.status_code, 404)

    def test_blog_filter_by_category(self):
        response = self.client.get('/api/blog/?category=mobile')
        self.assertEqual(len(response.data), 1)

    def test_draft_not_accessible(self):
        response = self.client.get('/api/blog/draft-post/')
        self.assertEqual(response.status_code, 404)

    def test_reading_time_present(self):
        response = self.client.get('/api/blog/hikers-afrique-stack/')
        self.assertIn('reading_time', response.data)
