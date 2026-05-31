import os
import django
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from foxfit.infrastructure.models import (
    TipoPessoaModel, SituacaoPessoaModel, TipoPlanoModel,
    PessoaModel, ClienteModel, FuncionarioModel, TreinoModel
)

def run():
    print("Iniciando seed do banco de dados...")

    # 1. Cria Tipos de Pessoas
    tipo_aluno, _ = TipoPessoaModel.objects.get_or_create(id_tipo_pessoa=1, defaults={"descricao": "Aluno"})
    tipo_func, _ = TipoPessoaModel.objects.get_or_create(id_tipo_pessoa=2, defaults={"descricao": "Funcionario"})
    print("Tipos de pessoa populados.")

    # 2. Cria Situacoes de Pessoa
    sit_ativa, _ = SituacaoPessoaModel.objects.get_or_create(id_situacao_pessoa=1, defaults={"descricao": "Ativo"})
    sit_inativa, _ = SituacaoPessoaModel.objects.get_or_create(id_situacao_pessoa=2, defaults={"descricao": "Inativo"})
    print("Situações de pessoa populadas.")

    # 3. Cria Planos
    plano_mensal, _ = TipoPlanoModel.objects.get_or_create(id_def_tipo_plano=1, defaults={"descricao": "Mensal"})
    plano_anual, _ = TipoPlanoModel.objects.get_or_create(id_def_tipo_plano=2, defaults={"descricao": "Anual"})
    print("Tipos de plano populados.")

    # 4. Cria Instrutor Mock (Funcionário)
    # email: instrutor@foxfit.com, senha: 3000300 (Matrícula)
    inst_pessoa, created = FuncionarioModel.objects.update_or_create(
        matricula="3000300",
        defaults={
            "nome": "Fulana de Medeiros",
            "id_tipo_pessoa": tipo_func,
            "cpf": "11122233344",
            "data_nascimento": datetime(1990, 5, 10),
            "email": "instrutor@foxfit.com",
            "id_situacao_pessoa": sit_ativa,
            "senha": "3000300",
            "data_admissao": datetime.now(),
            "cref": "CREF12345"
        }
    )
    print(f"Instrutor Fulana de Medeiros {'criado' if created else 'atualizado'}.")

    # 5. Cria Treino de Aluno Mock
    treino_aluno = TreinoModel.objects.create(
        descricao="Treino A: Supino Reto - 3x12, Crucifixo - 3x15, Tríceps Corda - 4x10 | Treino B: Leg Press 45 - 3x12, Cadeira Extensora - 3x15, Agachamento - 4x10"
    )

    # 6. Cria Aluno Mock
    # email: aluno@foxfit.com, senha: 1232026 (Matrícula)
    aluno_pessoa, created = ClienteModel.objects.update_or_create(
        matricula="1232026",
        defaults={
            "nome": "Fulano da Silva",
            "id_tipo_pessoa": tipo_aluno,
            "cpf": "99988877766",
            "data_nascimento": datetime(2001, 2, 20),
            "email": "aluno@foxfit.com",
            "id_situacao_pessoa": sit_ativa,
            "senha": "1232026",
            "objetivo": "Fortalecer pernas e abdômen",
            "peso_inicial": 70.00,
            "altura": 1.70,
            "observacao_medica": "Não fazer exercícios que exijam muito dos braços e ombros.",
            "id_treino": treino_aluno,
            "id_tipo_plano": plano_mensal
        }
    )
    print(f"Aluno Fulano da Silva {'criado' if created else 'atualizado'}.")
    print("Seed finalizado com sucesso!")

if __name__ == "__main__":
    run()
