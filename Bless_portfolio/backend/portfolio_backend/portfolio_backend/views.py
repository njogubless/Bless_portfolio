from django.http import JsonResponse


def health_check(request):
    """Trivial liveness endpoint for uptime checks / Render health checks."""
    return JsonResponse({'status': 'ok'})
