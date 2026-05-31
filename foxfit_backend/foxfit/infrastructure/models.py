from django.db import models

class TipoPessoaModel(models.Model):
    id_tipo_pessoa = models.SmallIntegerField(primary_key=True)
    descricao = models.CharField(max_length=20)

    def __str__(self):
        return self.descricao

    class Meta:
        db_table = 'def_id_tipo_pessoa'
        verbose_name = 'Tipo de Pessoa'
        verbose_name_plural = 'Tipos de Pessoa'


class SituacaoPessoaModel(models.Model):
    id_situacao_pessoa = models.SmallIntegerField(primary_key=True)
    descricao = models.CharField(max_length=30)

    def __str__(self):
        return self.descricao

    class Meta:
        db_table = 'def_situacao_pessoa'
        verbose_name = 'Situação de Pessoa'
        verbose_name_plural = 'Situações de Pessoa'


class TipoPlanoModel(models.Model):
    id_def_tipo_plano = models.SmallIntegerField(primary_key=True)
    descricao = models.CharField(max_length=20)

    def __str__(self):
        return self.descricao

    class Meta:
        db_table = 'def_tipo_plano'
        verbose_name = 'Tipo de Plano'
        verbose_name_plural = 'Tipos de Plano'


class TreinoModel(models.Model):
    id_treino = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=500)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)

    def __str__(self):
        desc_resumida = self.descricao[:30] + "..." if len(self.descricao) > 30 else self.descricao
        return f"Treino #{self.id_treino} ({desc_resumida})"

    class Meta:
        db_table = 'Treinos'
        verbose_name = 'Treino'
        verbose_name_plural = 'Treinos'


class PessoaModel(models.Model):
    id_pessoa = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    id_tipo_pessoa = models.ForeignKey(TipoPessoaModel, on_delete=models.PROTECT, db_column='id_tipo_pessoa')
    matricula = models.CharField(max_length=20, unique=True)
    cpf = models.CharField(max_length=20)
    data_nascimento = models.DateTimeField()
    telefone = models.CharField(max_length=20, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    id_situacao_pessoa = models.ForeignKey(SituacaoPessoaModel, on_delete=models.PROTECT, db_column='id_situacao_pessoa')
    usuario = models.CharField(max_length=50, null=True, blank=True)
    senha = models.CharField(max_length=100, null=True, blank=True)
    sexo = models.CharField(max_length=1, null=True, blank=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(null=True, blank=True)
    ultimo_acesso = models.DateTimeField(null=True, blank=True)
    foto_perfil = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.nome} (Matrícula: {self.matricula})"

    class Meta:
        db_table = 'Pessoas'
        verbose_name = 'Pessoa'
        verbose_name_plural = 'Pessoas'


# Multi-table inheritance (Clientes herda de Pessoas no Django)
class ClienteModel(PessoaModel):
    objetivo = models.CharField(max_length=400, null=True, blank=True)
    peso_inicial = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    altura = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    data_ultima_medidas = models.DateTimeField(null=True, blank=True)
    observacao_medica = models.CharField(max_length=300, null=True, blank=True)
    id_treino = models.ForeignKey(TreinoModel, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_treinoFK')
    id_instrutor = models.ForeignKey('FuncionarioModel', on_delete=models.SET_NULL, null=True, blank=True, db_column='id_instrutor')
    id_tipo_plano = models.ForeignKey(TipoPlanoModel, on_delete=models.PROTECT, db_column='id_tipo_plano')

    def __str__(self):
        return f"Cliente: {self.nome} (Matrícula: {self.matricula})"

    class Meta:
        db_table = 'Clientes'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'


class FuncionarioModel(PessoaModel):
    data_admissao = models.DateTimeField()
    cref = models.CharField(max_length=20)
    especialidade = models.CharField(max_length=100, null=True, blank=True)
    turno = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Funcionário: {self.nome} (CREF: {self.cref})"

    class Meta:
        db_table = 'Funcionarios'
        verbose_name = 'Funcionário'
        verbose_name_plural = 'Funcionários'


class CobrancaModel(models.Model):
    id_cobranca = models.AutoField(primary_key=True)
    id_pessoa = models.ForeignKey(PessoaModel, on_delete=models.CASCADE, db_column='id_pessoa')
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_vencimento = models.DateTimeField()
    data_pagamento = models.DateTimeField(null=True, blank=True)
    pago = models.BooleanField(default=False)
    metodo_pagamento = models.CharField(max_length=50)

    def __str__(self):
        return f"Cobrança #{self.id_cobranca} - {self.id_pessoa.nome} (R$ {self.valor})"

    class Meta:
        db_table = 'Cobranças'
        verbose_name = 'Cobrança'
        verbose_name_plural = 'Cobranças'
