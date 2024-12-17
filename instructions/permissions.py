from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied


class InstructionsModeratorMixin(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if request.user.instructions_moderator:
            return super().dispatch(request, *args, **kwargs)
        raise PermissionDenied('Нет прав')
