from django.urls import path
from .views import InstructionsTemplateView, InstructionsNewTemplateView
from .views_api import InstructionListCreateAPIView, InstructionDetailAPIView

urlpatterns = [
    path('', InstructionsTemplateView.as_view(), name='instructions'),
    path('new/', InstructionsNewTemplateView.as_view(), name='instructions_new'),
]

url_api_patterns = [
    path('', InstructionListCreateAPIView.as_view()),
    path('<int:pk>/', InstructionDetailAPIView.as_view()),
]
