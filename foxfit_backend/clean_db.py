from foxfit.infrastructure.models import ClienteModel, TreinoModel
from datetime import datetime

print("Desvinculando alunos dos treinos atuais...")
ClienteModel.objects.update(id_treino=None)

print("Apagando todos os treinos...")
TreinoModel.objects.all().delete()

print("Inserindo o treino padrao...")
default_desc = "Treino A: Supino Reto - 3x12, Crucifixo - 3x15, Tríceps Corda - 4x10 | Treino B: Leg Press 45 - 3x12, Cadeira Extensora - 3x15, Agachamento - 4x10"
novo_treino = TreinoModel.objects.create(
    descricao=default_desc,
    data_criacao=datetime.now(),
    data_ultima_atualizacao=datetime.now()
)

print(f"Treino padrao inserido com sucesso! ID: {novo_treino.id_treino}")
