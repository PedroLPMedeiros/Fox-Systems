from django.test import TestCase
from .infrastructure.models import ClienteModel, TipoPlanoModel, FuncionarioModel, TreinoModel
import datetime
from django.utils.timezone import now

class DatabaseIntegrationTest(TestCase):
    def setUp(self):
        # Criação de um tipo de plano base para os testes de CRUD
        self.plano = TipoPlanoModel.objects.create(
            nome="Plano Anual Teste", 
            descricao="Plano para bateria de testes", 
            valor_mensal=99.90, 
            duracao_meses=12
        )
        # Setup Inicial: Create
        self.cliente = ClienteModel.objects.create(
            nome="Lucas Silva",
            cpf="11122233344",
            email="lucas@teste.com",
            telefone="11999999999",
            matricula="MAT-TESTE-01",
            senha_hash="hashedpassword_mock",
            data_cadastro=now(),
            id_tipo_plano=self.plano,
            observacao_medica="Sem restrições."
        )

    def test_create_cliente(self):
        """Testa se o registro (C) do CRUD de Cliente é criado e lido com sucesso."""
        cliente_db = ClienteModel.objects.get(matricula="MAT-TESTE-01")
        self.assertTrue(isinstance(cliente_db, ClienteModel))
        self.assertEqual(cliente_db.nome, "Lucas Silva")

    def test_update_cliente(self):
        """Testa se a atualização (U) do CRUD de Cliente é propagada no Banco de Dados."""
        self.cliente.peso_inicial = 80.5
        self.cliente.save()
        cliente_db = ClienteModel.objects.get(matricula="MAT-TESTE-01")
        self.assertEqual(float(cliente_db.peso_inicial), 80.5)

    def test_delete_cliente(self):
        """Testa se a exclusão (D) do CRUD de Cliente funciona e respeita a integridade."""
        id_cliente = self.cliente.id_pessoa
        self.cliente.delete()
        with self.assertRaises(ClienteModel.DoesNotExist):
            ClienteModel.objects.get(id_pessoa=id_cliente)

    def test_integracao_treino_instrutor(self):
        """Teste de integração verificando se o vínculo Aluno -> Instrutor -> Treino opera corretamente."""
        instrutor = FuncionarioModel.objects.create(
            nome="Mestre Yoda",
            cpf="00000000000",
            email="yoda@jedi.com",
            telefone="000",
            matricula="JEDI-01",
            senha_hash="forcemock",
            data_cadastro=now(),
            data_admissao=now(),
            cref="000000-G/SP"
        )
        
        treino = TreinoModel.objects.create(
            descricao="Treino A: Puxar X-Wing 3x10",
            data_criacao=now(),
            data_ultima_atualizacao=now()
        )
        
        # Teste de Autorização / Permissão indireta vinculando
        self.cliente.id_instrutor = instrutor
        self.cliente.id_treino = treino
        self.cliente.save()
        
        cliente_db = ClienteModel.objects.get(matricula="MAT-TESTE-01")
        self.assertEqual(cliente_db.id_instrutor.nome, "Mestre Yoda")
        self.assertIn("X-Wing", cliente_db.id_treino.descricao)
