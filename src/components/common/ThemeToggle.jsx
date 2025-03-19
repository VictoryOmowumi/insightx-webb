import { useTheme } from 'next-themes';
import {  Moon, Sun } from "lucide-react";
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex w-10 min-h-10 h-full py-3 bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full justify-center items-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
    >
      {theme === 'dark' ? <Sun size={20} strokeWidth={1} /> : <Moon size={20} strokeWidth={1} />}
    </button>
  );
}