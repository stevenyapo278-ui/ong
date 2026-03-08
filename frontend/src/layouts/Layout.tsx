import React from 'react';
import Navbar from '../components/Navbar';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { ThemeProvider } from '../context/ThemeContext';

import ThemeToggle from '../components/ThemeToggle';
import CustomCursor from '../components/CustomCursor';

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

        <footer className="bg-slate-900 border-t border-slate-800 pt-24 pb-12 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-20 relative z-10">

            <div className="space-y-8 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start group">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-[18px] shadow-lg shadow-black/10 group-hover:scale-110 transition-transform overflow-hidden p-1">
                  <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="ml-4 text-left">
                  <p className="text-2xl font-black text-white tracking-tight leading-none uppercase italic">BIEN VIVRE ICI</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">ONG HUMANITAIRE</p>
                </div>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm mx-auto sm:mx-0">
                Propulser le changement par la transparence, le récit et l'action humanitaire directe sur le terrain. Ensemble, bâtissons un futur durable.
              </p>
              <div className="flex justify-center sm:justify-start gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"><Globe size={18} /></div>)}
              </div>
            </div>

            <div className="space-y-8 text-center sm:text-left">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">NAVIGATION</h4>
              <ul className="space-y-4">
                {['Accueil', 'Actualités', 'Nos Missions', 'Don'].map((item, i) => (
                  <li key={i}>
                    <button className="text-slate-400 font-bold hover:text-primary transition-colors text-sm hover:translate-x-1 inline-block transform transition-transform">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 text-center sm:text-left">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">PLATEFORME</h4>
              <ul className="space-y-4">
                {['Dashboard', 'Sécurité', 'Confidentialité', 'Support'].map((item, i) => (
                  <li key={i}>
                    <button className="text-slate-400 font-bold hover:text-primary transition-colors text-sm hover:translate-x-1 inline-block transform transition-transform">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 text-center sm:text-left">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">CONTACT NOUS</h4>
              <ul className="space-y-6">
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-slate-400 font-bold text-sm">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <span>Village Akouai Santai, Commune de Bingerville, Côte d'Ivoire</span>
                </li>
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-slate-400 font-bold text-sm">
                  <Mail size={18} className="text-primary shrink-0" />
                  <span>contact@ongbienvivreici.org</span>
                </li>
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-slate-400 font-bold text-sm">
                  <Phone size={18} className="text-secondary shrink-0" />
                  <span>+33 (0)1 23 45 67 89</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-12 pb-8 text-center flex flex-col items-center gap-8 relative z-10">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ONG BIEN VIVRE ICI. PROPULSÉ PAR LA TECHNOLOGIE & L'HUMANITÉ.
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
              <button className="hover:text-white transition-colors">Cookies</button>
              <button className="hover:text-white transition-colors">Légal</button>
              <button className="hover:text-white transition-colors">Steven Yapo</button>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
