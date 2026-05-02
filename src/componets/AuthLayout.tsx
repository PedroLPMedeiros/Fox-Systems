interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex h-screen w-screen bg-fox-black text-white overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="/Plano_Fundo_Academia.png" 
          alt="Plano de Fundo de Academia" 
          className="object-cover w-full h-full transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fox-black" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <header className="flex justify-center mb-10">
            <img src="/Logo_FoxFit.png" 
            alt="Logo Fox System" 
            className="h-60" />
          </header>
          
          {children}
          
          <footer className="mt-12 text-center text-xs text-zinc-600">
            © 2026 Fox System
          </footer>
        </div>
      </div>
    </main>
  );
}