export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-fox-red border-r-fox-red rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-fox-red rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="text-fox-red font-bold tracking-widest uppercase text-sm animate-pulse">Carregando...</p>
    </div>
  );
}
