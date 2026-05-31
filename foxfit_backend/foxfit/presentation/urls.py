from django.urls import path
from .views import LoginAPIView, ClienteListCreateAPIView, ClienteDetailAPIView, TreinoAPIView, TreinoListAPIView, FuncionarioDetailAPIView, VincularAlunoInstrutorAPIView, CriarTreinoClienteAPIView

urlpatterns = [
    path('auth/login/', LoginAPIView.as_view(), name='api-login'),
    path('clientes/', ClienteListCreateAPIView.as_view(), name='api-clientes-list-create'),
    path('clientes/<int:pk>/', ClienteDetailAPIView.as_view(), name='api-cliente-detail'),
    path('treinos/', TreinoListAPIView.as_view(), name='api-treino-list'),
    path('treinos/<int:pk>/', TreinoAPIView.as_view(), name='api-treino'),
    path('funcionarios/<int:pk>/', FuncionarioDetailAPIView.as_view(), name='api-funcionario-detail'),
    path('instrutores/vincular/', VincularAlunoInstrutorAPIView.as_view(), name='api-vincular-aluno'),
    path('clientes/<int:pk>/treinos/', CriarTreinoClienteAPIView.as_view(), name='api-criar-treino-cliente'),
]
