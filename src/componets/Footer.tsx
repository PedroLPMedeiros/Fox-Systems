export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-auto border-t border-zinc-900 bg-fox-black flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 opacity-70">
        <div />
        <span className="text-white-500 uppercase tracking-[0.2em] font-bold">
          Fox System
        </span>
      </div>
      
      <p className="text-zinc-600 text-sm uppercase tracking-widest">
        &copy; {currentYear} Todos os direitos reservados
      </p>
    </footer>
  );
}