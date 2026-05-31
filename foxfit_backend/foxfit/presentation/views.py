from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..domain.exceptions import CredenciaisInvalidasException, PessoaNaoEncontradaException
from ..application.use_cases import (
    RealizarLoginUseCase, CadastrarClienteUseCase, ListarClientesUseCase,
    ObterClienteUseCase, AtualizarClienteUseCase, ExcluirClienteUseCase, AtualizarTreinoUseCase,
    CadastrarFuncionarioUseCase, ObterFuncionarioUseCase, AtualizarFuncionarioUseCase, VincularAlunoInstrutorUseCase,
    CriarTreinoClienteUseCase, ObterTodosTreinosUseCase
)
from ..infrastructure.repositories import PessoaRepository, ClienteRepository, TreinoRepository, FuncionarioRepository
from .serializers import LoginRequestSerializer, ClienteCadastroSerializer, ClienteOutputSerializer, FuncionarioOutputSerializer

# Instancia repositórios
pessoa_repo = PessoaRepository()
cliente_repo = ClienteRepository()
treino_repo = TreinoRepository()
funcionario_repo = FuncionarioRepository()

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        use_case = RealizarLoginUseCase(pessoa_repo)
        try:
            res = use_case.execute(
                email_ou_matricula=serializer.validated_data['email'],
                senha_matricula=serializer.validated_data['password']
            )
            return Response(res, status=status.HTTP_200_OK)
        except CredenciaisInvalidasException as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class ClienteListCreateAPIView(APIView):
    def get(self, request):
        use_case = ListarClientesUseCase(cliente_repo)
        clientes = use_case.execute()
        serializer = ClienteOutputSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ClienteCadastroSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if ".instrutor" in serializer.validated_data['email'].lower():
                use_case = CadastrarFuncionarioUseCase(funcionario_repo)
                funcionario = use_case.execute(
                    nome=serializer.validated_data['nome'],
                    email=serializer.validated_data['email'],
                    matricula=serializer.validated_data['matricula'],
                    cpf=serializer.validated_data['cpf'],
                    data_nascimento=serializer.validated_data['data_nascimento']
                )
                out = FuncionarioOutputSerializer(funcionario)
                return Response(out.data, status=status.HTTP_201_CREATED)
            else:
                use_case = CadastrarClienteUseCase(cliente_repo, treino_repo)
                cliente = use_case.execute(
                    nome=serializer.validated_data['nome'],
                    email=serializer.validated_data['email'],
                    matricula=serializer.validated_data['matricula'],
                    cpf=serializer.validated_data['cpf'],
                    data_nascimento=serializer.validated_data['data_nascimento']
                )
                out = ClienteOutputSerializer(cliente)
                return Response(out.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            error_msg = str(e)
            if "UNIQUE constraint failed" in error_msg:
                if "matricula" in error_msg:
                    return Response({"error": "Já existe uma conta com esta matrícula."}, status=status.HTTP_400_BAD_REQUEST)
                if "email" in error_msg:
                    return Response({"error": "Já existe uma conta com este e-mail."}, status=status.HTTP_400_BAD_REQUEST)
                if "cpf" in error_msg:
                    return Response({"error": "Já existe uma conta com este CPF."}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"error": "Algum dado informado já está em uso por outro usuário."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)


class ClienteDetailAPIView(APIView):
    def get(self, request, pk):
        use_case = ObterClienteUseCase(cliente_repo)
        try:
            cliente = use_case.execute(id_pessoa=pk)
            out = ClienteOutputSerializer(cliente).data
            if cliente.id_treino_id:
                treino = treino_repo.find_by_id(cliente.id_treino_id)
                if treino:
                    out["treino"] = {
                        "id_treino": treino.id_treino,
                        "descricao": treino.descricao
                    }
            return Response(out, status=status.HTTP_200_OK)
        except PessoaNaoEncontradaException as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        use_case = AtualizarClienteUseCase(cliente_repo)
        try:
            cliente = use_case.execute(id_pessoa=pk, dados_atualizados=request.data)
            out = ClienteOutputSerializer(cliente)
            return Response(out.data, status=status.HTTP_200_OK)
        except PessoaNaoEncontradaException as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        use_case = ExcluirClienteUseCase(cliente_repo)
        use_case.execute(id_pessoa=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class TreinoListAPIView(APIView):
    def get(self, request):
        use_case = ObterTodosTreinosUseCase(treino_repo)
        treinos = use_case.execute()
        
        # Filtrar treinos para retornar apenas descrições únicas
        treinos_unicos = []
        descricoes_vistas = set()
        
        for t in treinos:
            if t.descricao and t.descricao not in descricoes_vistas:
                descricoes_vistas.add(t.descricao)
                treinos_unicos.append({
                    "id_treino": t.id_treino,
                    "descricao": t.descricao
                })
                
        return Response(treinos_unicos, status=status.HTTP_200_OK)


class TreinoAPIView(APIView):
    def get(self, request, pk):
        treino = treino_repo.find_by_id(pk)
        if not treino:
            return Response({"error": "Treino não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "id_treino": treino.id_treino,
            "descricao": treino.descricao
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        use_case = AtualizarTreinoUseCase(treino_repo)
        try:
            treino = use_case.execute(id_treino=pk, descricao=request.data.get("descricao"))
            return Response({
                "id_treino": treino.id_treino,
                "descricao": treino.descricao
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class FuncionarioDetailAPIView(APIView):
    def get(self, request, pk):
        use_case = ObterFuncionarioUseCase(funcionario_repo)
        try:
            funcionario = use_case.execute(id_pessoa=pk)
            out = FuncionarioOutputSerializer(funcionario)
            return Response(out.data, status=status.HTTP_200_OK)
        except PessoaNaoEncontradaException as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        use_case = AtualizarFuncionarioUseCase(funcionario_repo)
        try:
            funcionario = use_case.execute(id_pessoa=pk, dados_atualizados=request.data)
            out = FuncionarioOutputSerializer(funcionario)
            return Response(out.data, status=status.HTTP_200_OK)
        except PessoaNaoEncontradaException as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class VincularAlunoInstrutorAPIView(APIView):
    def post(self, request):
        id_aluno = request.data.get('id_aluno')
        id_instrutor = request.data.get('id_instrutor')
        
        if not id_aluno or not id_instrutor:
            return Response({"error": "Faltam parâmetros id_aluno ou id_instrutor"}, status=status.HTTP_400_BAD_REQUEST)
            
        use_case = VincularAlunoInstrutorUseCase(cliente_repo, funcionario_repo)
        try:
            cliente = use_case.execute(id_aluno=int(id_aluno), id_instrutor=int(id_instrutor))
            out = ClienteOutputSerializer(cliente)
            return Response(out.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CriarTreinoClienteAPIView(APIView):
    def post(self, request, pk):
        use_case = CriarTreinoClienteUseCase(cliente_repo, treino_repo)
        try:
            treino = use_case.execute(id_cliente=pk)
            return Response({
                "id_treino": treino.id_treino,
                "descricao": treino.descricao
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
