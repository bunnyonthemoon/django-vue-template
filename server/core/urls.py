from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView

from . import views

urlpatterns = []
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path('api/auth/', include('apps.authentication.urls')),
    path('admin/', admin.site.urls),
    re_path('', views.IndexPageView.as_view()),
]
