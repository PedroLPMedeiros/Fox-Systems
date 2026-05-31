from datetime import datetime
from typing import List, Optional
from ..domain.entities import Cliente, Treino, Pessoa
from ..domain.value_objects import CPF, Email
from ..domain.exceptions import CredenciaisInvalidasException, PessoaNaoEncontradaException
from .repositories import IClienteRepository, IPessoaRepository, ITreinoRepository
import jwt

JWT_SECRET = "foxfit-super-secret-key"

class RealizarLoginUseCase:
    def __init__(self, pessoa_repo: IPessoaRepository):
        self.pessoa_repo = pessoa_repo

    def execute(self, email_ou_matricula: str, senha_matricula: str) -> dict:
        pessoa = self.pessoa_repo.find_by_email_or_matricula(email_ou_matricula)
        if not pessoa:
            raise CredenciaisInvalidasException("Usuário não cadastrado.")
        
        # Como no front a senha inicial é a matrícula
        if pessoa.senha != senha_matricula and pessoa.matricula != senha_matricula:
            raise CredenciaisInvalidasException("Senha incorreta.")

        # Atualiza último acesso
        pessoa.ultimo_acesso = datetime.now()
        
        # Gera JWT payload simplificado
        payload = {
            "id_pessoa": pessoa.id_pessoa,
            "nome": pessoa.nome,
            "id_tipo_pessoa": pessoa.id_tipo_pessoa, # 1: Aluno, 2: Instrutor
            "matricula": pessoa.matricula,
            "exp": int(datetime.now().timestamp()) + 86400  # 1 dia expiração
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        
        return {
            "token": token,
            "tipo_pessoa": "instrutor" if pessoa.id_tipo_pessoa == 2 else "aluno",
            "id_pessoa": pessoa.id_pessoa
        }


class CadastrarClienteUseCase:
    def __init__(self, cliente_repo: IClienteRepository, treino_repo: ITreinoRepository):
        self.cliente_repo = cliente_repo
        self.treino_repo = treino_repo

    def execute(self, nome: str, email: str, matricula: str, cpf: str, data_nascimento: str) -> Cliente:
        # Cria um treino inicial vazio para o Aluno
        treino_inicial = Treino(
            id_treino=None,
            descricao="Treino A: Supino Reto - 3x12, Crucifixo - 3x15, Tríceps Corda - 4x10 | Treino B: Leg Press 45 - 3x12, Cadeira Extensora - 3x15, Agachamento - 4x10",
            data_criacao=datetime.now(),
            data_ultima_atualizacao=datetime.now()
        )
        treino_salvo = self.treino_repo.save(treino_inicial)

        # Entidade de Domínio
        cliente = Cliente(
            id_pessoa=None,
            nome=nome,
            id_tipo_pessoa=1,  # Aluno
            matricula=matricula,
            cpf=CPF(cpf),
            data_nascimento=datetime.strptime(data_nascimento, "%Y-%m-%d") if isinstance(data_nascimento, str) else data_nascimento,
            telefone=None,
            email=Email(email),
            id_situacao_pessoa=1,  # Ativo
            usuario=email,
            senha=matricula,  # Senha padrão é a matrícula
            sexo=None,
            data_cadastro=datetime.now(),
            data_ultima_atualizacao=None,
            ultimo_acesso=None,
            objetivo=None,
            peso_inicial=None,
            altura=None,
            data_ultima_medidas=None,
            observacao_medica=None,
            id_treino_id=treino_salvo.id_treino,
            id_instrutor_id=None,
            id_tipo_plano=1  # Plano Mensal Padrão
        )

        return self.cliente_repo.save(cliente)


class CadastrarFuncionarioUseCase:
    def __init__(self, funcionario_repo):
        self.funcionario_repo = funcionario_repo

    def execute(self, nome: str, email: str, matricula: str, cpf: str, data_nascimento: str) -> Funcionario:
        # Entidade de Domínio Funcionario
        from ..domain.entities import Funcionario
        funcionario = Funcionario(
            id_pessoa=None,
            nome=nome,
            id_tipo_pessoa=2,  # Instrutor / Funcionario
            matricula=matricula,
            cpf=CPF(cpf),
            data_nascimento=datetime.strptime(data_nascimento, "%Y-%m-%d") if isinstance(data_nascimento, str) else data_nascimento,
            telefone=None,
            email=Email(email),
            id_situacao_pessoa=1,  # Ativo
            usuario=email,
            senha=matricula,
            sexo=None,
            data_cadastro=datetime.now(),
            data_ultima_atualizacao=None,
            ultimo_acesso=None,
            data_admissao=datetime.now(),
            cref="N/A",  # Valor padrão até ser editado pelo adm real
            especialidade=None,
            turno=None
        )
        return self.funcionario_repo.save(funcionario)


class ListarClientesUseCase:
    def __init__(self, cliente_repo: IClienteRepository):
        self.cliente_repo = cliente_repo

    def execute(self) -> List[Cliente]:
        return self.cliente_repo.find_all()


class ObterClienteUseCase:
    def __init__(self, cliente_repo: IClienteRepository):
        self.cliente_repo = cliente_repo

    def execute(self, id_pessoa: int) -> Cliente:
        cliente = self.cliente_repo.find_by_id(id_pessoa)
        if not cliente:
            raise PessoaNaoEncontradaException("Cliente não encontrado.")
        return cliente


class ObterFuncionarioUseCase:
    def __init__(self, funcionario_repo):
        self.funcionario_repo = funcionario_repo

    def execute(self, id_pessoa: int):
        funcionario = self.funcionario_repo.find_by_id(id_pessoa)
        if not funcionario:
            raise PessoaNaoEncontradaException("Funcionário não encontrado.")
        return funcionario


class AtualizarClienteUseCase:
    def __init__(self, cliente_repo: IClienteRepository):
        self.cliente_repo = cliente_repo

    def execute(self, id_pessoa: int, dados_atualizados: dict) -> Cliente:
        cliente = self.cliente_repo.find_by_id(id_pessoa)
        if not cliente:
            raise PessoaNaoEncontradaException("Cliente não encontrado.")

        # Atualiza apenas os campos mutáveis permitidos pelo PATCH do front
        if "nome" in dados_atualizados:
            cliente.nome = dados_atualizados["nome"]
        if "altura" in dados_atualizados:
            cliente.altura = float(dados_atualizados["altura"])
        if "peso" in dados_atualizados:
            cliente.peso_inicial = float(dados_atualizados["peso"])
        if "observacao_medica" in dados_atualizados:
            cliente.observacao_medica = dados_atualizados["observacao_medica"]
        if "objetivo" in dados_atualizados:
            cliente.objetivo = dados_atualizados["objetivo"]
        if "id_situacao_pessoa" in dados_atualizados:
            cliente.id_situacao_pessoa = int(dados_atualizados["id_situacao_pessoa"])
        if "foto_perfil" in dados_atualizados:
            cliente.foto_perfil = dados_atualizados["foto_perfil"]

        cliente.data_ultima_atualizacao = datetime.now()
        return self.cliente_repo.save(cliente)


class AtualizarFuncionarioUseCase:
    def __init__(self, funcionario_repo):
        self.funcionario_repo = funcionario_repo

    def execute(self, id_pessoa: int, dados_atualizados: dict):
        funcionario = self.funcionario_repo.find_by_id(id_pessoa)
        if not funcionario:
            raise PessoaNaoEncontradaException("Funcionário não encontrado.")

        if "nome" in dados_atualizados:
            funcionario.nome = dados_atualizados["nome"]
        if "especialidade" in dados_atualizados:
            funcionario.especialidade = dados_atualizados["especialidade"]
        if "turno" in dados_atualizados:
            funcionario.turno = dados_atualizados["turno"]
        if "foto_perfil" in dados_atualizados:
            funcionario.foto_perfil = dados_atualizados["foto_perfil"]
        if "cref" in dados_atualizados:
            funcionario.cref = dados_atualizados["cref"]
        if "sexo" in dados_atualizados:
            funcionario.sexo = dados_atualizados["sexo"]

        funcionario.data_ultima_atualizacao = datetime.now()
        return self.funcionario_repo.save(funcionario)


class ExcluirClienteUseCase:
    def __init__(self, cliente_repo: IClienteRepository):
        self.cliente_repo = cliente_repo

    def execute(self, id_pessoa: int) -> None:
        self.cliente_repo.delete(id_pessoa)


class VincularAlunoInstrutorUseCase:
    def __init__(self, cliente_repo, funcionario_repo):
        self.cliente_repo = cliente_repo
        self.funcionario_repo = funcionario_repo

    def execute(self, id_aluno: int, id_instrutor: int) -> Cliente:
        aluno = self.cliente_repo.find_by_id(id_aluno)
        if not aluno:
            raise PessoaNaoEncontradaException("Aluno não encontrado.")
            
        instrutor = self.funcionario_repo.find_by_id(id_instrutor)
        if not instrutor:
            raise PessoaNaoEncontradaException("Instrutor não encontrado.")
            
        aluno.id_instrutor_id = instrutor.id_pessoa
        return self.cliente_repo.save(aluno)


class AtualizarTreinoUseCase:
    def __init__(self, treino_repo: ITreinoRepository):
        self.treino_repo = treino_repo

    def execute(self, id_treino: int, descricao: str) -> Treino:
        treino = self.treino_repo.find_by_id(id_treino)
        if not treino:
            raise PessoaNaoEncontradaException("Treino não encontrado.")
        treino.descricao = descricao
        treino.data_ultima_atualizacao = datetime.now()
        return self.treino_repo.save(treino)


class CriarTreinoClienteUseCase:
    def __init__(self, cliente_repo: IClienteRepository, treino_repo: ITreinoRepository):
        self.cliente_repo = cliente_repo
        self.treino_repo = treino_repo

    def execute(self, id_cliente: int) -> Treino:
        cliente = self.cliente_repo.find_by_id(id_cliente)
        if not cliente:
            raise PessoaNaoEncontradaException("Cliente não encontrado.")

        # Cria um novo treino vazio
        from ..domain.entities import Treino
        novo_treino = Treino(
            id_treino=None,
            descricao="",
            data_criacao=datetime.now(),
            data_ultima_atualizacao=datetime.now()
        )
        treino_salvo = self.treino_repo.save(novo_treino)

        # Vincula o treino ao cliente
        cliente.id_treino_id = treino_salvo.id_treino
        self.cliente_repo.save(cliente)

        return treino_salvo


class ObterTodosTreinosUseCase:
    def __init__(self, treino_repo: ITreinoRepository):
        self.treino_repo = treino_repo

    def execute(self) -> List[Treino]:
        return self.treino_repo.find_all()
