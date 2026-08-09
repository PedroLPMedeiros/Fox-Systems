from django.contrib.auth.models import User

# Verifica se o usuario admin existe
user, created = User.objects.get_or_create(username='admin')
# Define a nova senha
user.set_password('foxfit2026')
user.is_superuser = True
user.is_staff = True
user.save()

if created:
    print("Novo superusuário 'admin' criado com sucesso com a senha 'foxfit2026'!")
else:
    print("Senha do superusuário 'admin' foi redefinida para 'foxfit2026'!")
