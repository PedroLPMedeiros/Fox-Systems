from typing import List, Optional
from ..domain.entities import Cliente, Funcionario, Treino, Pessoa
from ..domain.value_objects import CPF, Email
from ..application.repositories import IClienteRepository, IPessoaRepository, ITreinoRepository, IFuncionarioRepository
from .models import ClienteModel, PessoaModel, TreinoModel, TipoPessoaModel, SituacaoPessoaModel, TipoPlanoModel, FuncionarioModel

class PessoaRepository(IPessoaRepository):
    def _to_entity(self, model: PessoaModel) -> Pessoa:
        return Pessoa(
            id_pessoa=model.id_pessoa,
            nome=model.nome,
            id_tipo_pessoa=model.id_tipo_pessoa.id_tipo_pessoa,
            matricula=model.matricula,
            cpf=CPF(model.cpf),
            data_nascimento=model.data_nascimento,
            telefone=model.telefone,
            email=Email(model.email) if model.email else None,
            id_situacao_pessoa=model.id_situacao_pessoa.id_situacao_pessoa,
            usuario=model.usuario,
            senha=model.senha,
            sexo=model.sexo,
            data_cadastro=model.data_cadastro,
            data_ultima_atualizacao=model.data_ultima_atualizacao,
            ultimo_acesso=model.ultimo_acesso,
            foto_perfil=model.foto_perfil
        )

    def find_by_id(self, id_pessoa: int) -> Optional[Pessoa]:
        try:
            model = PessoaModel.objects.get(id_pessoa=id_pessoa)
            return self._to_entity(model)
        except PessoaModel.DoesNotExist:
            return None

    def find_by_email_or_matricula(self, ident: str) -> Optional[Pessoa]:
        try:
            model = PessoaModel.objects.filter(email=ident).first() or PessoaModel.objects.filter(matricula=ident).first()
            if model:
                return self._to_entity(model)
            return None
        except Exception:
            return None


class ClienteRepository(IClienteRepository):
    def _to_entity(self, model: ClienteModel) -> Cliente:
        return Cliente(
            id_pessoa=model.id_pessoa,
            nome=model.nome,
            id_tipo_pessoa=model.id_tipo_pessoa.id_tipo_pessoa,
            matricula=model.matricula,
            cpf=CPF(model.cpf),
            data_nascimento=model.data_nascimento,
            telefone=model.telefone,
            email=Email(model.email) if model.email else None,
            id_situacao_pessoa=model.id_situacao_pessoa.id_situacao_pessoa,
            usuario=model.usuario,
            senha=model.senha,
            sexo=model.sexo,
            data_cadastro=model.data_cadastro,
            data_ultima_atualizacao=model.data_ultima_atualizacao,
            ultimo_acesso=model.ultimo_acesso,
            objetivo=model.objetivo,
            peso_inicial=float(model.peso_inicial) if model.peso_inicial else None,
            altura=float(model.altura) if model.altura else None,
            data_ultima_medidas=model.data_ultima_medidas,
            observacao_medica=model.observacao_medica,
            id_treino_id=model.id_treino.id_treino if model.id_treino else None,
            id_instrutor_id=model.id_instrutor.id_pessoa if model.id_instrutor else None,
            id_tipo_plano=model.id_tipo_plano.id_def_tipo_plano,
            foto_perfil=model.foto_perfil
        )

    def save(self, entity: Cliente) -> Cliente:
        tipo_pessoa_ref = TipoPessoaModel.objects.get(id_tipo_pessoa=entity.id_tipo_pessoa)
        situacao_ref = SituacaoPessoaModel.objects.get(id_situacao_pessoa=entity.id_situacao_pessoa)
        tipo_plano_ref = TipoPlanoModel.objects.get(id_def_tipo_plano=entity.id_tipo_plano)
        treino_ref = TreinoModel.objects.get(id_treino=entity.id_treino_id) if entity.id_treino_id else None

        instrutor_ref = FuncionarioModel.objects.get(id_pessoa=entity.id_instrutor_id) if entity.id_instrutor_id else None

        model, created = ClienteModel.objects.update_or_create(
            id_pessoa=entity.id_pessoa,
            defaults={
                "nome": entity.nome,
                "id_tipo_pessoa": tipo_pessoa_ref,
                "matricula": entity.matricula,
                "cpf": entity.cpf.valor,
                "data_nascimento": entity.data_nascimento,
                "telefone": entity.telefone,
                "email": entity.email.valor if entity.email else None,
                "id_situacao_pessoa": situacao_ref,
                "usuario": entity.usuario,
                "senha": entity.senha,
                "sexo": entity.sexo,
                "objetivo": entity.objetivo,
                "peso_inicial": entity.peso_inicial,
                "altura": entity.altura,
                "data_ultima_medidas": entity.data_ultima_medidas,
                "observacao_medica": entity.observacao_medica,
                "id_treino": treino_ref,
                "id_instrutor": instrutor_ref,
                "id_tipo_plano": tipo_plano_ref,
                "foto_perfil": getattr(entity, 'foto_perfil', None)
            }
        )
        entity.id_pessoa = model.id_pessoa
        return entity

    def find_by_id(self, id_pessoa: int) -> Optional[Cliente]:
        try:
            model = ClienteModel.objects.get(id_pessoa=id_pessoa)
            return self._to_entity(model)
        except ClienteModel.DoesNotExist:
            return None

    def find_all(self) -> List[Cliente]:
        models = ClienteModel.objects.all()
        return [self._to_entity(m) for m in models]

    def delete(self, id_pessoa: int) -> None:
        ClienteModel.objects.filter(id_pessoa=id_pessoa).delete()


class FuncionarioRepository(IFuncionarioRepository):
    def _to_entity(self, model: FuncionarioModel) -> Funcionario:
        return Funcionario(
            id_pessoa=model.id_pessoa,
            nome=model.nome,
            id_tipo_pessoa=model.id_tipo_pessoa.id_tipo_pessoa,
            matricula=model.matricula,
            cpf=CPF(model.cpf),
            data_nascimento=model.data_nascimento,
            telefone=model.telefone,
            email=Email(model.email) if model.email else None,
            id_situacao_pessoa=model.id_situacao_pessoa.id_situacao_pessoa,
            usuario=model.usuario,
            senha=model.senha,
            sexo=model.sexo,
            data_cadastro=model.data_cadastro,
            data_ultima_atualizacao=model.data_ultima_atualizacao,
            ultimo_acesso=model.ultimo_acesso,
            data_admissao=model.data_admissao,
            cref=model.cref,
            especialidade=model.especialidade,
            turno=model.turno,
            foto_perfil=model.foto_perfil
        )
        
    def save(self, entity: Funcionario) -> Funcionario:
        tipo_pessoa_ref = TipoPessoaModel.objects.get(id_tipo_pessoa=entity.id_tipo_pessoa)
        situacao_ref = SituacaoPessoaModel.objects.get(id_situacao_pessoa=entity.id_situacao_pessoa)

        model, created = FuncionarioModel.objects.update_or_create(
            id_pessoa=entity.id_pessoa,
            defaults={
                "nome": entity.nome,
                "id_tipo_pessoa": tipo_pessoa_ref,
                "matricula": entity.matricula,
                "cpf": entity.cpf.valor,
                "data_nascimento": entity.data_nascimento,
                "telefone": entity.telefone,
                "email": entity.email.valor if entity.email else None,
                "id_situacao_pessoa": situacao_ref,
                "usuario": entity.usuario,
                "senha": entity.senha,
                "sexo": entity.sexo,
                "data_admissao": entity.data_admissao,
                "cref": entity.cref,
                "especialidade": getattr(entity, 'especialidade', None),
                "turno": getattr(entity, 'turno', None),
                "foto_perfil": getattr(entity, 'foto_perfil', None)
            }
        )
        entity.id_pessoa = model.id_pessoa
        return entity

    def find_by_id(self, id_pessoa: int) -> Optional[Funcionario]:
        try:
            model = FuncionarioModel.objects.get(id_pessoa=id_pessoa)
            return self._to_entity(model)
        except FuncionarioModel.DoesNotExist:
            return None


class TreinoRepository(ITreinoRepository):
    def _to_entity(self, model: TreinoModel) -> Treino:
        return Treino(
            id_treino=model.id_treino,
            descricao=model.descricao,
            data_criacao=model.data_criacao,
            data_ultima_atualizacao=model.data_ultima_atualizacao
        )

    def save(self, entity: Treino) -> Treino:
        model, created = TreinoModel.objects.update_or_create(
            id_treino=entity.id_treino,
            defaults={
                "descricao": entity.descricao
            }
        )
        entity.id_treino = model.id_treino
        entity.data_criacao = model.data_criacao
        entity.data_ultima_atualizacao = model.data_ultima_atualizacao
        return entity

    def find_by_id(self, id_treino: int) -> Optional[Treino]:
        try:
            model = TreinoModel.objects.get(id_treino=id_treino)
            return self._to_entity(model)
        except TreinoModel.DoesNotExist:
            return None

    def find_all(self) -> List[Treino]:
        models = TreinoModel.objects.all()
        return [self._to_entity(m) for m in models]
