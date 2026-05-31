from datetime import datetime
from typing import Optional, List
from .value_objects import CPF, Email

class Treino:
    def __init__(self, id_treino: Optional[int], descricao: str, data_criacao: datetime, data_ultima_atualizacao: datetime):
        self.id_treino = id_treino
        self.descricao = descricao
        self.data_criacao = data_criacao
        self.data_ultima_atualizacao = data_ultima_atualizacao


class Pessoa:
    def __init__(self, id_pessoa: Optional[int], nome: str, id_tipo_pessoa: int, matricula: str,
                 cpf: CPF, data_nascimento: datetime, telefone: Optional[str], email: Optional[Email],
                 id_situacao_pessoa: int, usuario: Optional[str], senha: Optional[str], sexo: Optional[str],
                 data_cadastro: datetime, data_ultima_atualizacao: Optional[datetime], ultimo_acesso: Optional[datetime],
                 foto_perfil: Optional[str] = None):
        self.id_pessoa = id_pessoa
        self.nome = nome
        self.id_tipo_pessoa = id_tipo_pessoa  # 1: Aluno, 2: Instrutor/Funcionario
        self.matricula = matricula
        self.cpf = cpf
        self.data_nascimento = data_nascimento
        self.telefone = telefone
        self.email = email
        self.id_situacao_pessoa = id_situacao_pessoa
        self.usuario = usuario
        self.senha = senha
        self.sexo = sexo
        self.data_cadastro = data_cadastro
        self.data_ultima_atualizacao = data_ultima_atualizacao
        self.ultimo_acesso = ultimo_acesso
        self.foto_perfil = foto_perfil


class Cliente(Pessoa):
    def __init__(self, id_pessoa: Optional[int], nome: str, id_tipo_pessoa: int, matricula: str,
                 cpf: CPF, data_nascimento: datetime, telefone: Optional[str], email: Optional[Email],
                 id_situacao_pessoa: int, usuario: Optional[str], senha: Optional[str], sexo: Optional[str],
                 data_cadastro: datetime, data_ultima_atualizacao: Optional[datetime], ultimo_acesso: Optional[datetime],
                 objetivo: Optional[str], peso_inicial: Optional[float], altura: Optional[float],
                 data_ultima_medidas: Optional[datetime], observacao_medica: str, id_treino_id: Optional[int],
                 id_instrutor_id: Optional[int], id_tipo_plano: int, foto_perfil: Optional[str] = None):
        super().__init__(id_pessoa, nome, id_tipo_pessoa, matricula, cpf, data_nascimento, telefone, email,
                         id_situacao_pessoa, usuario, senha, sexo, data_cadastro, data_ultima_atualizacao, ultimo_acesso, foto_perfil)
        self.objetivo = objetivo
        self.peso_inicial = peso_inicial
        self.altura = altura
        self.data_ultima_medidas = data_ultima_medidas
        self.observacao_medica = observacao_medica
        self.id_treino_id = id_treino_id
        self.id_instrutor_id = id_instrutor_id
        self.id_tipo_plano = id_tipo_plano


class Funcionario(Pessoa):
    def __init__(self, id_pessoa: Optional[int], nome: str, id_tipo_pessoa: int, matricula: str,
                 cpf: CPF, data_nascimento: datetime, telefone: Optional[str], email: Optional[Email],
                 id_situacao_pessoa: int, usuario: Optional[str], senha: Optional[str], sexo: Optional[str],
                 data_cadastro: datetime, data_ultima_atualizacao: Optional[datetime], ultimo_acesso: Optional[datetime],
                 data_admissao: datetime, cref: str, especialidade: Optional[str] = None, turno: Optional[str] = None, foto_perfil: Optional[str] = None):
        super().__init__(id_pessoa, nome, id_tipo_pessoa, matricula, cpf, data_nascimento, telefone, email,
                         id_situacao_pessoa, usuario, senha, sexo, data_cadastro, data_ultima_atualizacao, ultimo_acesso, foto_perfil)
        self.data_admissao = data_admissao
        self.cref = cref
        self.especialidade = especialidade
        self.turno = turno


class Cobranca:
    def __init__(self, id_cobranca: Optional[int], id_pessoa: int, valor: float, data_vencimento: datetime,
                 data_pagamento: Optional[datetime], pago: bool, metodo_pagamento: str):
        self.id_cobranca = id_cobranca
        self.id_pessoa = id_pessoa
        self.valor = valor
        self.data_vencimento = data_vencimento
        self.data_pagamento = data_pagamento
        self.pago = pago
        self.metodo_pagamento = metodo_pagamento
