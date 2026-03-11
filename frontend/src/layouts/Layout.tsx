import React from 'react';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import CustomCursor from '../components/CustomCursor';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <CustomCursor />
        <ThemeToggle />
        <main className="flex-grow pt-28 md:pt-32">
          {children}
        </main>

        <Footer />
        <CookieBanner />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
