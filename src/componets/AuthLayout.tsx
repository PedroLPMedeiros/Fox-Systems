import { Footer } from "./Footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex h-screen w-screen bg-fox-black text-white overflow-hidden">
      {/* Lado Esquerdo: Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="/Plano_Fundo_Academia.png" 
          alt="Plano de Fundo de Academia" 
          className="object-cover w-full h-full transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fox-black" />
      </div>

      {/* Lado Direito: Área de conteúdo com scroll interno se necessário */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto">
        <div className="min-h-full flex flex-col p-6 sm:p-12">
          
          {/* Container Superior: Logo e Formulário */}
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="w-full max-w-md">
              <header className="flex justify-center mb-10">
                <img 
                  src="/Logo_FoxFit.png" 
                  alt="Logo Fox System" 
                  className="h-40 md:h-60 object-contain" 
                />
              </header>
              
              {children}
            </div>
          </div>

          {/* Footer sempre no final do scroll desta coluna */}
          <Footer />
        </div>
      </div>
    </main>
  );
}