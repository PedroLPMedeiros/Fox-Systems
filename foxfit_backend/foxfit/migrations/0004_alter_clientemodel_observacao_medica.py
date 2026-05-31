

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foxfit', '0003_pessoamodel_foto_perfil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientemodel',
            name='observacao_medica',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]
