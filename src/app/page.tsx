import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-fox-black text-white p-4 text-center">
      <img 
      src="/Logo_FoxFit.png" 
      alt="Fox System" 
      className="h-70 mb-8" />
      <h1 className="text-2xl font-bold mb-6">Bem-vindo ao Fox System</h1>
      <div className="flex gap-4">
        <Link href="/login" className="bg-fox-red px-6 py-3 rounded font-bold hover:bg-red-700 transition">
          Ir para Login
        </Link>
        <Link href="/cadastro" className="border border-zinc-700 px-6 py-3 rounded font-bold hover:bg-zinc-800 transition">
          Criar Conta
        </Link>
      </div>
    </main>
  );
}