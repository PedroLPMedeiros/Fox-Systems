from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def welcome_view(request):
    html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FoxFit API Gateway</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0c0a09;
            --card-bg: rgba(28, 25, 23, 0.6);
            --border-color: rgba(63, 63, 70, 0.4);
            --fox-red: #ef4444;
            --text-primary: #f5f5f4;
            --text-secondary: #a8a29e;
            
            --get-color: #22c55e;
            --post-color: #3b82f6;
            --patch-color: #eab308;
            --delete-color: #ef4444;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: 'Outfit', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .blob {
            position: absolute;
            width: 450px;
            height: 450px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%);
            z-index: 0;
            filter: blur(40px);
            animation: float 10s ease-in-out infinite;
        }
        .blob-1 { top: -120px; left: -120px; }
        .blob-2 { bottom: -120px; right: -120px; animation-delay: -5s; }
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(35px, 35px) scale(1.08); }
        }
        .container {
            width: 100%;
            max-width: 900px;
            padding: 50px 20px;
            z-index: 1;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo-text {
            font-size: 3.2rem;
            font-weight: 800;
            letter-spacing: -2px;
            text-transform: uppercase;
            font-style: italic;
            background: linear-gradient(135deg, #ffffff 0%, #a8a29e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .logo-text span {
            color: var(--fox-red);
            -webkit-text-fill-color: var(--fox-red);
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #4ade80;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 15px;
            text-transform: uppercase;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background-color: #22c55e;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        
        /* Cabeçalho Colapsável */
        .category-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 24px;
            background: rgba(28, 25, 23, 0.4);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            cursor: pointer;
            margin: 25px 0 0 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            backdrop-filter: blur(12px);
        }
        .category-header:hover {
            background: rgba(28, 25, 23, 0.7);
            border-color: var(--fox-red);
        }
        .category-title-wrapper {
            display: flex;
            align-items: center;
            gap: 14px;
            width: 100%;
        }
        .category-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        .category-indicator {
            width: 4px;
            height: 24px;
            background: var(--fox-red);
            border-radius: 2px;
        }
        .chevron {
            width: 22px;
            height: 22px;
            fill: none;
            stroke: var(--text-secondary);
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Animação do Conteúdo Colapsável */
        .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out;
            opacity: 0;
            padding: 0 5px;
        }
        .collapsible-content.active {
            opacity: 1;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
            gap: 20px;
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 22px;
            text-align: left;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(12px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            margin-bottom: 2px;
        }
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .card:hover {
            transform: translateY(-3px);
            border-color: var(--fox-red);
            box-shadow: 0 10px 25px -10px rgba(239, 68, 68, 0.15);
        }
        .card:hover::before {
            opacity: 1;
        }
        
        .card-tag {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--fox-red);
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            display: block;
        }
        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .method-badge {
            align-self: flex-start;
            font-size: 0.65rem;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }
        .method-get { background: rgba(34, 197, 94, 0.1); color: var(--get-color); border: 1px solid rgba(34, 197, 94, 0.15); }
        .method-post { background: rgba(59, 130, 246, 0.1); color: var(--post-color); border: 1px solid rgba(59, 130, 246, 0.15); }
        .method-patch { background: rgba(234, 179, 8, 0.1); color: var(--patch-color); border: 1px solid rgba(234, 179, 8, 0.15); }
        .method-delete { background: rgba(239, 68, 68, 0.1); color: var(--delete-color); border: 1px solid rgba(239, 68, 68, 0.15); }
        
        .endpoint-path {
            font-family: monospace;
            font-size: 0.95rem;
            color: #e7e5e4;
            font-weight: 600;
            margin-bottom: 6px;
        }
        .card-desc {
            font-size: 0.85rem;
            color: var(--text-secondary);
            line-height: 1.4;
            margin-bottom: auto;
        }
        
        .nav-warning {
            display: block;
            font-size: 0.7rem;
            color: #f87171;
            font-weight: 600;
            margin-top: 15px;
            font-style: italic;
        }

        .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 0.85rem;
            color: #57534e;
        }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="container">
        <div class="header">
            <h1 class="logo-text">Fox<span>Fit</span> API Gateway</h1>
            <p style="color: var(--text-secondary); margin-top: 10px; font-size: 1.1rem;">
                Back-end oficial estruturado em Domain-Driven Design (DDD)
            </p>
            <div>
                <span class="status-badge">
                    <span class="status-dot"></span>
                    API Status: Online
                </span>
            </div>
        </div>

        <!-- Seção do Django Admin -->
        <div class="grid" style="margin-bottom: 25px;">
            <a href="/admin/" target="_blank" class="card">
                <div>
                    <span class="card-tag">Admin Panel</span>
                    <h3 class="card-title">Django Admin</h3>
                    <p class="card-desc" style="margin-bottom: 0;">Gerenciamento completo e visual das tabelas do banco de dados (Pessoas, Clientes, Treinos, Cobranças).</p>
                </div>
            </a>
        </div>

        <!-- Categoria 1: Autenticação -->
        <div class="category-header" onclick="toggleSection(this)">
            <div class="category-title-wrapper">
                <div class="category-indicator"></div>
                <h2 class="category-title">Autenticação</h2>
            </div>
            <svg class="chevron" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
        <div class="collapsible-content">
            <div class="grid" style="padding: 15px 0;">
                <div class="card">
                    <span class="method-badge method-post">POST</span>
                    <div class="endpoint-path">/api/auth/login/</div>
                    <p class="card-desc">Faz login de Alunos ou Instrutores. Retorna tipo de pessoa e Token JWT.</p>
                    <span class="nav-warning">⚠️ Requer Postman/Front-end</span>
                </div>
            </div>
        </div>

        <!-- Categoria 2: Clientes -->
        <div class="category-header" onclick="toggleSection(this)">
            <div class="category-title-wrapper">
                <div class="category-indicator"></div>
                <h2 class="category-title">Clientes (Alunos)</h2>
            </div>
            <svg class="chevron" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
        <div class="collapsible-content">
            <div class="grid" style="padding: 15px 0;">
                <a href="/api/clientes/" target="_blank" class="card">
                    <span class="method-badge method-get">GET</span>
                    <div class="endpoint-path">/api/clientes/</div>
                    <p class="card-desc">Lista todos os alunos matriculados e seus respectivos treinos ativos.</p>
                </a>
                <div class="card">
                    <span class="method-badge method-post">POST</span>
                    <div class="endpoint-path">/api/clientes/</div>
                    <p class="card-desc">Cadastra um novo aluno no banco de dados vinculando o seu primeiro plano.</p>
                    <span class="nav-warning">⚠️ Requer Postman/Front-end</span>
                </div>
                <a href="/api/clientes/1/" target="_blank" class="card">
                    <span class="method-badge method-get">GET</span>
                    <div class="endpoint-path">/api/clientes/&lt;id&gt;/</div>
                    <p class="card-desc">Retorna o perfil completo do aluno especificado por ID e os detalhes do seu treino.</p>
                </a>
                <div class="card">
                    <span class="method-badge method-patch">PATCH</span>
                    <div class="endpoint-path">/api/clientes/&lt;id&gt;/</div>
                    <p class="card-desc">Atualiza parcialmente dados do aluno (peso, altura, objetivo, observações).</p>
                    <span class="nav-warning">⚠️ Requer Postman/Front-end</span>
                </div>
                <div class="card">
                    <span class="method-badge method-delete">DELETE</span>
                    <div class="endpoint-path">/api/clientes/&lt;id&gt;/</div>
                    <p class="card-desc">Exclui permanentemente o aluno correspondente ao ID informado.</p>
                    <span class="nav-warning">⚠️ Requer Postman/Front-end</span>
                </div>
            </div>
        </div>

        <!-- Categoria 3: Treinos -->
        <div class="category-header" onclick="toggleSection(this)">
            <div class="category-title-wrapper">
                <div class="category-indicator"></div>
                <h2 class="category-title">Fichas de Treino</h2>
            </div>
            <svg class="chevron" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
        <div class="collapsible-content">
            <div class="grid" style="padding: 15px 0;">
                <a href="/api/treinos/1/" target="_blank" class="card">
                    <span class="method-badge method-get">GET</span>
                    <div class="endpoint-path">/api/treinos/&lt;id&gt;/</div>
                    <p class="card-desc">Obtém a descrição e a ficha completa de exercícios de um treino por ID.</p>
                </a>
                <div class="card">
                    <span class="method-badge method-patch">PATCH</span>
                    <div class="endpoint-path">/api/treinos/&lt;id&gt;/</div>
                    <p class="card-desc">Atualiza a descrição dos exercícios (Ficha A/B) do treino especificado.</p>
                    <span class="nav-warning">⚠️ Requer Postman/Front-end</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Desenvolvido para Fox Systems &copy; 2026. Feito com Django & SQLite.</p>
        </div>
    </div>

    <script>
        function toggleSection(header) {
            const content = header.nextElementSibling;
            const chevron = header.querySelector('.chevron');
            
            content.classList.toggle('active');
            
            if (content.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 30 + "px";
                chevron.style.transform = 'rotate(90deg)';
                
                // Remove limitação de overflow após a transição para não cortar sombras/hover
                content.addEventListener('transitionend', function onEnd() {
                    if (content.classList.contains('active')) {
                        content.style.maxHeight = 'none';
                        content.style.overflow = 'visible';
                    }
                    content.removeEventListener('transitionend', onEnd);
                });
            } else {
                content.style.maxHeight = content.scrollHeight + 30 + "px";
                content.style.overflow = 'hidden';
                
                // Força reflow
                content.offsetHeight;
                
                setTimeout(() => {
                    content.style.maxHeight = '0';
                    chevron.style.transform = 'rotate(0deg)';
                }, 10);
            }
        }
    </script>
</body>
</html>"""
    return HttpResponse(html_content)

urlpatterns = [
    path('', welcome_view, name='welcome'),
    path('admin/', admin.site.urls),
    path('api/', include('foxfit.presentation.urls')),
]
