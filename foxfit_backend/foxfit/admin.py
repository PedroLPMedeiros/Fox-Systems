from django.contrib import admin
from .infrastructure.models import (
    TipoPessoaModel, SituacaoPessoaModel, TipoPlanoModel,
    PessoaModel, ClienteModel, FuncionarioModel, CobrancaModel, TreinoModel
)

@admin.register(TipoPessoaModel)
class TipoPessoaAdmin(admin.ModelAdmin):
    list_display = ('id_tipo_pessoa', 'descricao')

@admin.register(SituacaoPessoaModel)
class SituacaoPessoaAdmin(admin.ModelAdmin):
    list_display = ('id_situacao_pessoa', 'descricao')

@admin.register(TipoPlanoModel)
class TipoPlanoAdmin(admin.ModelAdmin):
    list_display = ('id_def_tipo_plano', 'descricao')

@admin.register(TreinoModel)
class TreinoAdmin(admin.ModelAdmin):
    list_display = ('id_treino', 'descricao', 'data_criacao', 'data_ultima_atualizacao')

@admin.register(PessoaModel)
class PessoaAdmin(admin.ModelAdmin):
    list_display = ('id_pessoa', 'nome', 'matricula', 'cpf', 'id_tipo_pessoa', 'id_situacao_pessoa')
    search_fields = ('nome', 'matricula', 'cpf')

@admin.register(ClienteModel)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_pessoa', 'nome', 'matricula', 'id_tipo_plano', 'id_instrutor')
    search_fields = ('nome', 'matricula')

@admin.register(FuncionarioModel)
class FuncionarioAdmin(admin.ModelAdmin):
    list_display = ('id_pessoa', 'nome', 'matricula', 'cref', 'data_admissao')
    search_fields = ('nome', 'matricula', 'cref')

@admin.register(CobrancaModel)
class CobrancaAdmin(admin.ModelAdmin):
    list_display = ('id_cobranca', 'id_pessoa', 'valor', 'data_vencimento', 'pago')
    list_filter = ('pago', 'data_vencimento')
