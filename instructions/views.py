from django.shortcuts import render
from django.views.generic import TemplateView


class InstructionsTemplateView(TemplateView):
    template_name = "instructions_main.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {"title": "Инструкции"})


class InstructionsNewTemplateView(TemplateView):
    template_name = "instructions_new.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {"title": "Новая инструкция"})
