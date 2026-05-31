from abc import ABC, abstractmethod
from typing import List, Optional
from ..domain.entities import Cliente, Funcionario, Treino, Pessoa

class IPessoaRepository(ABC):
    @abstractmethod
    def find_by_id(self, id_pessoa: int) -> Optional[Pessoa]:
        pass

    @abstractmethod
    def find_by_email_or_matricula(self, ident: str) -> Optional[Pessoa]:
        pass


class IClienteRepository(ABC):
    @abstractmethod
    def save(self, cliente: Cliente) -> Cliente:
        pass

    @abstractmethod
    def find_by_id(self, id_pessoa: int) -> Optional[Cliente]:
        pass

    @abstractmethod
    def find_all(self) -> List[Cliente]:
        pass

    @abstractmethod
    def delete(self, id_pessoa: int) -> None:
        pass


class IFuncionarioRepository(ABC):
    @abstractmethod
    def save(self, funcionario: Funcionario) -> Funcionario:
        pass

    @abstractmethod
    def find_by_id(self, id_pessoa: int) -> Optional[Funcionario]:
        pass


class ITreinoRepository(ABC):
    @abstractmethod
    def save(self, treino: Treino) -> Treino:
        pass

    @abstractmethod
    def find_by_id(self, id_treino: int) -> Optional[Treino]:
        pass

    @abstractmethod
    def find_all(self) -> List[Treino]:
        pass
