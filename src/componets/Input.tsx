import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input 
      {...props}
      className={`p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none transition ${props.className}`}
    />
  );
}