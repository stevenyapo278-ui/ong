import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-[999] p-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            ) : (
                <Moon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            )}
        </button>
    );
};

export default ThemeToggle;
