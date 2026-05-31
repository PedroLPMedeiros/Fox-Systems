import re

class CPF:
    def __init__(self, valor: str):
        cleaned = re.sub(r'\D', '', valor)
        if len(cleaned) != 11:
            raise ValueError("CPF deve conter 11 dígitos.")
        self.valor = cleaned

    def __str__(self):
        return f"{self.valor[:3]}.{self.valor[3:6]}.{self.valor[6:9]}-{self.valor[9:]}"


class Email:
    def __init__(self, valor: str):
        if valor and not re.match(r"[^@]+@[^@]+\.[^@]+", valor):
            raise ValueError("E-mail inválido.")
        self.valor = valor

    def __str__(self):
        return self.valor
