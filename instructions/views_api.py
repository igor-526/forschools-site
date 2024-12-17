from django.utils import timezone
from django.db.models import Q
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Instruction, InstructionFiles
from .serializers import (InstructionFilesListSerializer, InstructionFilesAdminSerializer,
                          InstructionsListSerializer, InstructionsListAdminSerializer,
                          InstructionsSerializer, InstructionsAdminSerializer,
                          InstructionFilesIMGOnlySerializer)


class InstructionListCreateAPIView(ListCreateAPIView):
    def filter_queryset_role(self, queryset):
        roles = self.request.query_params.getlist('role')
        if not roles:
            return queryset.order_by('name')
        q = Q()
        if 'listeners' in roles:
            q |= Q(visible_listeners__visibility=True)
        if 'teachers' in roles:
            q |= Q(visible_teachers__visibility=True)
        if 'curators' in roles:
            q |= Q(visible_curators__visibility=True)
        if 'methodists' in roles:
            q |= Q(visible_methodists__visibility=True)
        if 'administrators' in roles:
            q |= Q(visible_administrators__visibility=True)
        if len(roles) == 1:
            return queryset.filter(q).order_by(f'visible_{roles[0]}__ordering')
        else:
            return queryset.filter(q).order_by('name')

    def filter_queryset_name(self, queryset):
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset

    def filter_queryset_upload(self, queryset):
        upload_start = self.request.query_params.get('upload_start')
        upload_end = self.request.query_params.get('upload_end')
        if upload_start or upload_end:
            query = dict()
            if upload_start:
                start_date = timezone.datetime.strptime(upload_start, '%Y-%m-%d',)
                query['uploaded_at__date__gte'] = start_date
            if upload_end:
                end_date = timezone.datetime.strptime(upload_end, '%Y-%m-%d')
                query['uploaded_at__date__lte'] = end_date
            queryset = queryset.filter(**query)
        return queryset

    def filter_queryset_changed(self, queryset):
        changed_start = self.request.query_params.get('changed_start')
        changed_end = self.request.query_params.get('changed_end')
        if changed_start or changed_end:
            query = dict()
            if changed_start:
                start_date = timezone.datetime.strptime(changed_start, '%Y-%m-%d',)
                query['changed_at__date__gte'] = start_date
            if changed_end:
                end_date = timezone.datetime.strptime(changed_end, '%Y-%m-%d')
                query['changed_at__date__lte'] = end_date
            queryset = queryset.filter(**query)
        return queryset

    def get_queryset(self):
        queryset = Instruction.objects.all()
        queryset = self.filter_queryset_name(queryset)
        queryset = self.filter_queryset_upload(queryset)
        queryset = self.filter_queryset_changed(queryset)
        queryset = self.filter_queryset_role(queryset)
        return queryset.distinct() if queryset else None

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.instructions_moderator:
            return InstructionsListAdminSerializer
        return InstructionsListSerializer


class InstructionDetailAPIView(RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Instruction.objects.all()

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.instructions_moderator:
            return InstructionsAdminSerializer
        return InstructionsSerializer


class InstructionFilesListCreateAPIView(ListCreateAPIView):
    def get_queryset(self):
        queryset = InstructionFiles.objects.all()
        return queryset

    def get_serializer_class(self):
        return InstructionFilesListSerializer


class InstructionFilesDetailAPIView(RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return InstructionFiles.objects.all()

    def get_serializer_class(self):
        if self.request.query_params.get("imgonly"):
            return InstructionFilesIMGOnlySerializer
        return InstructionFilesAdminSerializer
