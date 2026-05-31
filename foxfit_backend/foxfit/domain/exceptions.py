class DomainException(Exception):
    pass

class PessoaNaoEncontradaException(DomainException):
    pass

class CredenciaisInvalidasException(DomainException):
    pass

class MatriculaDuplicadaException(DomainException):
    pass
