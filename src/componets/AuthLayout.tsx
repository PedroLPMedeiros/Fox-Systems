import { Footer } from "./Footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex h-screen w-screen bg-fox-black text-white overflow-hidden">
      <div className="hidden lg:flex w-1/2 bg-zinc-900 items-center justify-center relative overflow-hidden">
        <img 
          src="/Plano_Fundo_Academia.png" 
          alt="Plano de Fundo de Academia" 
          className="object-cover w-full h-full transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fox-black" />
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col">
        <div className="min-h-full flex flex-col p-6 sm:p-12">
          
          <div className="w-full max-w-md mx-auto space-y-8 flex-grow flex flex-col justify-center items-center">
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

          <div className="w-full mt-8">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}