from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Instruction
from .serializers import (InstructionFilesListSerializer, InstructionFilesAdminSerializer,
                          InstructionsListSerializer, InstructionsListAdminSerializer,
                          InstructionsSerializer, InstructionsAdminSerializer)


class InstructionListCreateAPIView(ListCreateAPIView):
    def filter_queryset_role(self, queryset):
        if not queryset:
            return None
        role = self.request.query_params.get('role')
        if role == 'listeners':
            return queryset.filter(visible_listeners__visibility=True).order_by('visible_listeners__ordering')
        if role == 'teachers':
            return queryset.filter(visible_teachers__visibility=True).order_by('visible_teachers__ordering')
        if role == 'curators':
            return queryset.filter(visible_curators__visibility=True).order_by('visible_curators__ordering')
        if role == 'methodists':
            return queryset.filter(visible_methodists__visibility=True).order_by('visible_methodists__ordering')
        if role == 'administrators':
            return queryset.filter(visible_administrators__visibility=True).order_by('visible_administrators__ordering')
        return queryset.order_by('name')

    def get_queryset(self):
        queryset = Instruction.objects.all()
        queryset = self.filter_queryset_role(queryset)
        return queryset.distinct() if queryset else None

    def get_serializer_class(self):
        return InstructionsListAdminSerializer


class InstructionDetailAPIView(RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Instruction.objects.all()

    def get_serializer_class(self):
        return InstructionsAdminSerializer
