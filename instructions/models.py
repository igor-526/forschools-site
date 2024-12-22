from django.db import models
from account_management.models import Account


class InstructionFiles(models.Model):
    name = models.CharField(max_length=120,
                            verbose_name="Наименование",
                            null=False,
                            default="Изображение")
    alt = models.CharField(max_length=120,
                           verbose_name="Альтернативное наименование",
                           null=False,
                           default="Изображение")
    file = models.FileField(verbose_name='Файл',
                            upload_to='instructions/',
                            null=False,
                            blank=False)
    owner = models.ForeignKey("account_management.Account",
                              verbose_name='Владелец',
                              on_delete=models.DO_NOTHING,
                              related_name='instruction_files_owner',
                              null=True,
                              blank=True)
    uploaded_at = models.DateTimeField(verbose_name='Дата и время загрузки',
                                       auto_now_add=True,
                                       null=False,
                                       blank=True)

    class Meta:
        verbose_name = 'Файл к инструкции',
        verbose_name_plural = 'Файлы к инструкции',
        ordering = ['name']

    def __str__(self):
        return self.name


class Instruction(models.Model):
    name = models.CharField(verbose_name='Наименование',
                            null=False,
                            blank=False,
                            max_length=250)
    instruction = models.TextField(verbose_name='Инструкция',
                                   null=False,
                                   blank=False)
    visible_listeners = models.JSONField(verbose_name="Настройки видимости у учеников",
                                         blank=True,
                                         null=True)
    visible_teachers = models.JSONField(verbose_name="Настройки видимости у преподавателей",
                                        blank=True,
                                        null=True)
    visible_administrators = models.JSONField(verbose_name="Настройки видимости у администраторов",
                                              blank=True,
                                              null=True)
    visible_methodists = models.JSONField(verbose_name="Настройки видимости у методистов",
                                          blank=True,
                                          null=True)
    visible_curators = models.JSONField(verbose_name="Настройки видимости у кураторов",
                                        blank=True,
                                        null=True)
    uploaded_at = models.DateTimeField(verbose_name='Дата и время загрузки',
                                       auto_now_add=True,
                                       null=False,
                                       blank=True)
    changed_at = models.DateTimeField(verbose_name='Последнее изменение',
                                      auto_now_add=True,
                                      null=False,
                                      blank=True)
    owner = models.ForeignKey("account_management.Account",
                              verbose_name='Владелец',
                              on_delete=models.DO_NOTHING,
                              related_name='instruction_owner',
                              null=True,
                              blank=True)
    files = models.ManyToManyField(InstructionFiles,
                                   verbose_name="Файлы к инструкции",
                                   related_name='instruction_files')

    class Meta:
        verbose_name = 'Инструкция',
        verbose_name_plural = 'Инструкции',
        ordering = ['name']

    def __str__(self):
        return self.name
