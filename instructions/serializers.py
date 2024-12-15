from rest_framework import serializers
from account_management.serializers import AccountNameOnlySerializer
from .models import Instruction, InstructionFiles


class InstructionFilesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionFiles
        fields = ['id', 'name', 'alt', 'file']


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

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'uploaded_at', 'changed_at', 'owner']

    def create(self, validated_data):
        request = self.context.get('request')
        inst_data = {
            "name": request.POST['name'],
            "instruction": request.POST['instruction'],
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
        instance = Instruction(**inst_data)
        instance.save()
        return instance


class InstructionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruction
        fields = ['id', 'name']


class InstructionsAdminSerializer(serializers.ModelSerializer):
    name = AccountNameOnlySerializer(read_only=True, many=False)

    class Meta:
        model = Instruction
        fields = ['id', 'name', 'instruction', 'uploaded_at', 'changed_at', 'owner']

