from django.contrib import admin
from django.urls import path, include
from . import settings
from django.conf.urls.static import static
from homepage.views import HomePageView
from instructions.urls import (urlpatterns as instructions_urlpatterns,
                               url_api_patterns as api_instructions_urlpatterns)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomePageView.as_view(), name='home'),
    path('instructions/', include(instructions_urlpatterns)),
    path('api/instructions/', include(api_instructions_urlpatterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
