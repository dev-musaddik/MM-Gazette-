import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all duration-300 ${
          theme === "light"
            ? "bg-white text-yellow-500 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all duration-300 ${
           theme === "system"
            ? "bg-white dark:bg-slate-600 text-accent shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        title="System Preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
