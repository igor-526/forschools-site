from rest_framework import serializers
from account_management.serializers import AccountNameOnlySerializer
from forschools.utils import get_file_type
from .models import Instruction, InstructionFiles
from django.utils import timezone
import re


class InstructionFilesListSerializer(serializers.ModelSerializer):
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = InstructionFiles
        fields = ['id', 'name', 'alt', 'file', 'file_type']

    def get_file_type(self, obj):
        return get_file_type(obj.file.name)


class InstructionFilesItemSerializer(serializers.ModelSerializer):
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = InstructionFiles
        fields = ['id', 'alt', 'file', 'file_type']

    def get_file_type(self, obj):
        return get_file_type(obj.file.name)


class InstructionFilesAdminSerializer(serializers.ModelSerializer):
    name = AccountNameOnlySerializer(read_only=True, many=False)

    class Meta:
        model = InstructionFiles
        fields = ['id', 'name', 'alt', 'file', 'owner', 'uploaded_at']


class InstructionsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruction
        fields = ['id', 'name', 'instruction']


class InstructionsListAdminSerializer(serializers.ModelSerializer):
    owner = AccountNameOnlySerializer(read_only=True, many=False)
    visibility = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'uploaded_at', 'changed_at', 'owner', 'visibility']

    def get_visibility(self, obj):
        return get_visibility_dict(obj)

    def create(self, validated_data):
        request = self.context.get('request')
        inst_data = get_instructions_instance_data(request)
        instance = Instruction(**inst_data)
        instance.save()
        instance.files.set(get_instructions_files(inst_data['instruction']))

        return instance


class InstructionsSerializer(serializers.ModelSerializer):
    files = InstructionFilesItemSerializer(many=True, read_only=True)

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'instruction', 'files']


class InstructionsAdminSerializer(serializers.ModelSerializer):
    owner = AccountNameOnlySerializer(read_only=True, many=False)
    visibility = serializers.SerializerMethodField(read_only=True)
    files = InstructionFilesItemSerializer(many=True, read_only=True)

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'instruction', 'uploaded_at', 'changed_at', 'owner', 'visibility', 'files']

    def get_visibility(self, obj):
        return get_visibility_dict(obj)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        inst_data = get_instructions_instance_data(request, instance)
        instance.name = inst_data['name']
        instance.instruction = inst_data['instruction']
        instance.visible_listeners = inst_data['visible_listeners']
        instance.visible_teachers = inst_data['visible_teachers']
        instance.visible_administrators = inst_data['visible_administrators']
        instance.visible_methodists = inst_data['visible_methodists']
        instance.visible_curators = inst_data['visible_curators']
        instance.changed_at = timezone.now()
        instance.files.set(get_instructions_files(inst_data['instruction']))
        instance.save()
        return instance

    def create(self, validated_data):
        request = self.context.get('request')
        inst_data = get_instructions_instance_data(request)
        instance = Instruction(**inst_data)
        instance.files.set(get_instructions_files(inst_data['instruction']))
        return instance


def get_instructions_instance_data(request, instance: Instruction = None):
    inst_data = {
        'name': request.POST['name'],
        'instruction': request.POST['instruction'],
        'visible_listeners': None,
        'visible_teachers': None,
        'visible_methodists': None,
        'visible_curators': None,
        'visible_administrators': None,
    }
    if "listeners" in request.POST.getlist('role'):
        instruction_ordering = instance.visible_listeners.get("ordering") if \
            (instance and instance.visible_listeners is not None)\
            else Instruction.objects.filter(visible_listeners__visibility=True).count() + 1
        inst_data['visible_listeners'] = {
            'visibility': True,
            'ordering': instruction_ordering,
        }
    if "teachers" in request.POST.getlist('role'):
        instruction_ordering = instance.visible_teachers.get("ordering") if \
            (instance and instance.visible_teachers is not None) \
            else Instruction.objects.filter(visible_teachers__visibility=True).count() + 1
        inst_data['visible_teachers'] = {
            'visibility': True,
            'ordering': instruction_ordering,
        }
    if "methodists" in request.POST.getlist('role'):
        instruction_ordering = instance.visible_methodists.get("ordering") if \
            (instance and instance.visible_methodists is not None) \
            else Instruction.objects.filter(visible_methodists__visibility=True).count() + 1
        inst_data['visible_methodists'] = {
            'visibility': True,
            'ordering': instruction_ordering,
        }
    if "curators" in request.POST.getlist('role'):
        instruction_ordering = instance.visible_curators.get("ordering") if \
            (instance and instance.visible_curators is not None) \
            else Instruction.objects.filter(visible_curators__visibility=True).count() + 1
        inst_data['visible_curators'] = {
            'visibility': True,
            'ordering': instruction_ordering,
        }
    if "administrators" in request.POST.getlist('role'):
        instruction_ordering = instance.visible_administrators.get("ordering") if \
            (instance and instance.visible_administrators is not None) \
            else Instruction.objects.filter(visible_administrators__visibility=True).count() + 1
        inst_data['visible_administrators'] = {
            'visibility': True,
            'ordering': instruction_ordering,
        }
    return inst_data


def get_instructions_files(instruction: str):
    pattern = r'\[file:(\d+)\]'
    matches = re.findall(pattern, instruction)
    return matches


def get_visibility_dict(obj):
    visibility = []
    if obj.visible_listeners:
        visibility.append("listeners")
    if obj.visible_teachers:
        visibility.append("teachers")
    if obj.visible_administrators:
        visibility.append("administrators")
    if obj.visible_methodists:
        visibility.append("methodists")
    if obj.visible_curators:
        visibility.append("curators")
    return visibility
