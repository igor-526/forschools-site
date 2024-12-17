from django.shortcuts import render
from django.views.generic import TemplateView
from .permissions import InstructionsModeratorMixin


class InstructionsTemplateView(TemplateView):
    template_name = "instructions_main.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {"title": "Инструкции"})


class InstructionsManagementTemplateView(InstructionsModeratorMixin, TemplateView):
    template_name = "instructions_management.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {"title": "Все инструкции"})


class InstructionsNewTemplateView(InstructionsModeratorMixin, TemplateView):
    template_name = "instructions_new.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {
                          "title": "Редактирование инструкции",
                          "pk": kwargs.get("pk")
                      })
