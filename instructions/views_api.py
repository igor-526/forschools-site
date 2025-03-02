from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Instruction, InstructionFiles
from .serializers import (InstructionFilesListSerializer, InstructionFilesAdminSerializer,
                          InstructionsListSerializer, InstructionsListAdminSerializer,
                          InstructionsSerializer, InstructionsAdminSerializer,
                          InstructionFilesItemSerializer)


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


class InstructionListReplaceAPIView(APIView):
    def post(self, request, *args, **kwargs):
        print(kwargs)
        try:
            instruction = Instruction.objects.get(pk=kwargs.get('pk'))
        except Instruction.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if kwargs.get('role') == "teachers":
            visible_settings = instruction.visible_teachers
            replace_instruction_key = "visible_teachers__ordering"
        elif kwargs.get('role') == "curators":
            visible_settings = instruction.visible_curators
            replace_instruction_key = "visible_curators__ordering"
        elif kwargs.get('role') == "methodists":
            visible_settings = instruction.visible_methodists
            replace_instruction_key = "visible_methodists__ordering"
        elif kwargs.get('role') == "administrators":
            visible_settings = instruction.visible_administrators
            replace_instruction_key = "visible_administrators__ordering"
        elif kwargs.get('role') == "listeners":
            visible_settings = instruction.visible_listeners
            replace_instruction_key = "visible_listeners__ordering"
        else:
            visible_settings = None
            replace_instruction_key = None
        if visible_settings is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        current_ordering = visible_settings.get("ordering")
        if current_ordering == 1:
            return Response(status=status.HTTP_200_OK)
        if kwargs.get('direction') == "up":
            new_ordering = current_ordering - 1
        elif kwargs.get('direction') == "down":
            new_ordering = current_ordering + 1
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        replace_instruction = Instruction.objects.filter(**{replace_instruction_key: new_ordering}).first()
        if replace_instruction is None:
            return Response(status=status.HTTP_200_OK)
        if kwargs.get('role') == "teachers":
            instruction.visible_teachers['ordering'] = new_ordering
            replace_instruction.visible_teachers['ordering'] = current_ordering
        elif kwargs.get('role') == "curators":
            instruction.visible_curators['ordering'] = new_ordering
            replace_instruction.visible_curators['ordering'] = current_ordering
        elif kwargs.get('role') == "methodists":
            instruction.visible_methodists['ordering'] = new_ordering
            replace_instruction.visible_methodists['ordering'] = current_ordering
        elif kwargs.get('role') == "administrators":
            instruction.visible_administrators['ordering'] = new_ordering
            replace_instruction.visible_administrators['ordering'] = current_ordering
        elif kwargs.get('role') == "listeners":
            instruction.visible_listeners['ordering'] = new_ordering
            replace_instruction.visible_listeners['ordering'] = current_ordering
        instruction.save()
        replace_instruction.save()
        return Response({}, status=status.HTTP_200_OK)


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
            return InstructionFilesItemSerializer
        return InstructionFilesAdminSerializer
