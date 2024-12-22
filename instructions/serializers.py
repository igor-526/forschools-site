from rest_framework import serializers
from account_management.serializers import AccountNameOnlySerializer
from .models import Instruction, InstructionFiles
from django.utils import timezone
import re


class InstructionFilesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionFiles
        fields = ['id', 'name', 'alt', 'file']


class InstructionFilesIMGOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionFiles
        fields = ['id', 'alt', 'file']


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
    files = InstructionFilesIMGOnlySerializer(many=True, read_only=True)

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'instruction', 'files']


class InstructionsAdminSerializer(serializers.ModelSerializer):
    owner = AccountNameOnlySerializer(read_only=True, many=False)
    visibility = serializers.SerializerMethodField(read_only=True)
    files = InstructionFilesIMGOnlySerializer(many=True, read_only=True)

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'instruction', 'uploaded_at', 'changed_at', 'owner', 'visibility', 'files']

    def get_visibility(self, obj):
        return get_visibility_dict(obj)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        inst_data = get_instructions_instance_data(request)
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


def get_instructions_instance_data(request):
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
        last_num = (Instruction.objects.filter(visible_listeners__visibility=True)
                    .order_by("-visible_listeners__visibility").first())
        inst_data['visible_listeners'] = {
            'visibility': True,
            'ordering': last_num.visible_listeners.get('ordering') + 1 if last_num else 1,
        }
    if "teachers" in request.POST.getlist('role'):
        last_num = (Instruction.objects.filter(visible_teachers__visibility=True)
                    .order_by("-visible_teachers__visibility").first())
        inst_data['visible_teachers'] = {
            'visibility': True,
            'ordering': last_num.visible_teachers.get('ordering') + 1 if last_num else 1,
        }
    if "methodists" in request.POST.getlist('role'):
        last_num = (Instruction.objects.filter(visible_methodists__visibility=True)
                    .order_by("-visible_methodists__visibility").first())
        inst_data['visible_methodists'] = {
            'visibility': True,
            'ordering': last_num.visible_methodists.get('ordering') + 1 if last_num else 1,
        }
    if "curators" in request.POST.getlist('role'):
        last_num = (Instruction.objects.filter(visible_curators__visibility=True)
                    .order_by("-visible_curators__visibility").first())
        inst_data['visible_curators'] = {
            'visibility': True,
            'ordering': last_num.visible_curators.get('ordering') + 1 if last_num else 1,
        }
    if "administrators" in request.POST.getlist('role'):
        last_num = (Instruction.objects.filter(visible_administrators__visibility=True)
                    .order_by("-visible_administrators__visibility").first())
        inst_data['visible_administrators'] = {
            'visibility': True,
            'ordering': last_num.visible_administrators.get('ordering') + 1 if last_num else 1,
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
