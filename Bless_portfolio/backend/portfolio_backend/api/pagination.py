from rest_framework.pagination import PageNumberPagination


class MessagePagination(PageNumberPagination):
    """Keeps the admin-only contact-message list from growing unbounded."""

    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100
