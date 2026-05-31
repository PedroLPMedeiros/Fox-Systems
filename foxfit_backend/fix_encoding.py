import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from foxfit.infrastructure.models import TreinoModel

print("Corrigindo encoding...")
treinos = TreinoModel.objects.all()
fixed_count = 0

for t in treinos:
    if t.descricao and "Tr??ceps" in t.descricao:
        t.descricao = t.descricao.replace("Tr??ceps", "Tríceps")
        t.save()
        fixed_count += 1

print(f"{fixed_count} treinos corrigidos com sucesso!")
