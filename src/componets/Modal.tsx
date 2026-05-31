import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export function Modal({ isOpen, onClose, title, message, type = 'info' }: ModalProps) {
  if (!isOpen) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          {isSuccess && (
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
          {isError && (
            <div className="w-16 h-16 rounded-full bg-fox-red/10 flex items-center justify-center text-fox-red mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
          )}
          {!isError && !isSuccess && (
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-white mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          )}
          
          <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">{title}</h3>
          <p className="text-zinc-400 text-sm">{message}</p>
          
          <button 
            onClick={onClose} 
            className="w-full mt-6 bg-fox-red text-white font-bold py-3 rounded-xl uppercase tracking-wider text-sm hover:bg-red-700 transition"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
