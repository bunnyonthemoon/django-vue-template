import json

from django.views.generic.base import TemplateView, View
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


class IndexPageView(TemplateView):

    template_name = "index.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        return self.render_to_response(context)
