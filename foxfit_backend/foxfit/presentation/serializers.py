from rest_framework import serializers

class LoginRequestSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()


class ClienteCadastroSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    matricula = serializers.CharField(max_length=20)
    cpf = serializers.CharField(max_length=20)
    data_nascimento = serializers.CharField(max_length=15)  # "YYYY-MM-DD"


class ClienteOutputSerializer(serializers.Serializer):
    id_pessoa = serializers.IntegerField()
    nome = serializers.CharField()
    matricula = serializers.CharField()
    email = serializers.CharField()
    cpf = serializers.CharField()
    objetivo = serializers.CharField()
    peso = serializers.FloatField(source='peso_inicial')
    altura = serializers.FloatField()
    observacao_medica = serializers.CharField()
    id_treino_id = serializers.IntegerField()
    id_situacao_pessoa = serializers.IntegerField()
    id_instrutor_id = serializers.IntegerField(allow_null=True, required=False)
    foto_perfil = serializers.CharField(allow_null=True, required=False)


class FuncionarioOutputSerializer(serializers.Serializer):
    id_pessoa = serializers.IntegerField()
    nome = serializers.CharField()
    matricula = serializers.CharField()
    email = serializers.CharField()
    cpf = serializers.CharField()
    especialidade = serializers.CharField(allow_null=True)
    turno = serializers.CharField(allow_null=True)
    cref = serializers.CharField(allow_null=True, required=False)
    sexo = serializers.CharField(allow_null=True, required=False)
    foto_perfil = serializers.CharField(allow_null=True, required=False)

