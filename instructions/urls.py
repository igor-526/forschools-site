from django.urls import path
from .views import InstructionsTemplateView, InstructionsNewTemplateView, InstructionsManagementTemplateView
from .views_api import (InstructionListCreateAPIView, InstructionDetailAPIView,
                        InstructionFilesListCreateAPIView, InstructionFilesDetailAPIView, InstructionListReplaceAPIView)

urlpatterns = [
    path('', InstructionsTemplateView.as_view(), name='instructions'),
    path('new/<int:pk>/', InstructionsNewTemplateView.as_view()),
    path('new/', InstructionsNewTemplateView.as_view(), name='instructions_new'),
    path('management/', InstructionsManagementTemplateView.as_view(), name='instructions_management'),
]

url_api_patterns = [
    path('', InstructionListCreateAPIView.as_view()),
    path('<int:pk>/', InstructionDetailAPIView.as_view()),
    path('<int:pk>/replace-<str:role>/<str:direction>/', InstructionListReplaceAPIView.as_view()),
    path('files/', InstructionFilesListCreateAPIView.as_view()),
    path('files/<int:pk>/', InstructionFilesDetailAPIView.as_view()),
]
