import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, ShieldCheck, LayoutGrid, Newspaper, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = () => setShowUserMenu(false);

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, children, icon: Icon }: { to: string, children: string, icon?: any }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${active
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'text-foreground-muted hover:text-primary hover:bg-primary/10'
          }`}
      >
        {Icon && <Icon size={14} className={active ? 'text-white' : 'text-foreground-muted group-hover:text-primary'} />}
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-[90] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`fixed top-0 sm:top-6 inset-x-0 z-[100] transition-all duration-500 max-w-[1400px] mx-auto px-4 sm:px-6`}>
        <div className={`mx-auto transition-all duration-300 ${scrolled
          ? 'bg-background/80 backdrop-blur-2xl py-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border mt-2 rounded-[30px]'
          : 'bg-background py-3 px-5 shadow-sm border border-border mt-4 rounded-[40px]'
          }`}>
          <div className="flex justify-between items-center h-12 relative">

            {/* Logo Icon (Left) */}
            <Link to="/" className="flex items-center group shrink-0 z-10">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-lg shadow-black/5 group-hover:scale-110 transition-transform overflow-hidden p-1 border border-border">
                <img src="/assets/logo.png" alt="Logo ONG Bien Vivre Ici" className="w-full h-full object-contain" />
              </div>
            </Link>

            {/* Brand Title (Centered on Mobile, Static on Desktop) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center lg:static lg:left-auto lg:translate-x-0 lg:ml-3 lg:items-start pointer-events-none">
              <Link to="/" className="pointer-events-auto flex flex-col items-center lg:items-start">
                <div className="flex items-baseline gap-x-1 sm:gap-x-1.5 overflow-hidden whitespace-nowrap">
                  <span className="text-sm xs:text-base sm:text-lg lg:text-xl font-black text-foreground italic text-secondary">BIEN</span>
                  <span className="text-sm xs:text-base sm:text-lg lg:text-xl font-black text-foreground text-accent-blue">VIVRE</span>
                  <span className="text-sm xs:text-base sm:text-lg lg:text-xl font-black text-foreground text-primary">ICI</span>
                </div>
                <span className="text-[7px] sm:text-[10px] font-black text-foreground-muted uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-0.5 leading-none">ONG HUMANITAIRE</span>
              </Link>
            </div>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-2 flex-grow justify-center px-6">
              <NavLink to="/" icon={LayoutGrid}>Accueil</NavLink>
              <NavLink to="/nos-combats" icon={ShieldCheck}>Nos Combats</NavLink>
              <NavLink to="/actualites" icon={Newspaper}>Actualités</NavLink>
              <NavLink to="/espace-donateur" icon={Heart}>Faire un don</NavLink>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-3 z-10">
              {/* Desktop User Tools */}
              <div className="hidden lg:flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <NavLink to="/dashboard" icon={ShieldCheck}>Dashboard</NavLink>
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                        className="flex items-center gap-3 bg-background-alt pl-2 pr-4 py-1.5 rounded-full border border-border hover:bg-background hover:border-primary transition-all cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-black text-foreground tracking-tight whitespace-nowrap">{user.name}</span>
                        <ChevronDown size={14} className={`text-foreground-muted transition-all duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 w-64 mt-4 origin-top-right bg-background rounded-[30px] shadow-2xl py-3 border border-border z-50">
                          <div className="px-6 py-4 border-b border-border mb-2">
                            <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-1">CONNECTÉ EN TANT QUE</p>
                            <p className="text-sm font-black text-foreground truncate">{user.name}</p>
                          </div>
                          <Link to="/dashboard" className="flex items-center px-6 py-3 text-sm font-bold text-foreground-muted hover:bg-primary/10 hover:text-primary transition-all">
                            <LayoutGrid size={16} className="mr-3" /> Dashboard
                          </Link>
                          <button onClick={handleLogout} className="flex items-center w-full px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all text-left">
                            <LogOut size={16} className="mr-3" /> Déconnexion
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-foreground-muted hover:text-primary transition-all px-4">Connexion</Link>
                    <Link to="/login" className="bg-foreground text-background px-8 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/10">Rejoindre</Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center gap-3 px-4 py-2.5 bg-background-alt hover:bg-primary/10 rounded-full border border-border text-foreground-muted hover:text-primary transition-all group"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden xs:block">Menu</span>
                <div className="relative w-5 h-5 flex items-center justify-center">
                  {isOpen ? <X size={20} className="text-primary" /> : <Menu size={20} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <div
          className={`lg:hidden fixed inset-x-4 top-24 z-[100] bg-background rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-border transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95 pointer-events-none'}`}
        >
          <div className="p-10 space-y-10">
            {/* Branding in Menu */}
            <div className="flex items-center gap-5 border-b border-border pb-10">
              <img src="/assets/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black italic text-secondary leading-none">BIEN</span>
                  <span className="text-2xl font-black text-accent-blue leading-none">VIVRE</span>
                  <span className="text-2xl font-black text-primary leading-none">ICI</span>
                </div>
                <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] mt-2">Bâtissons un monde meilleur</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className={`flex items-center justify-between p-6 rounded-3xl transition-all ${location.pathname === '/' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-background-alt text-foreground-muted hover:bg-primary/5 hover:text-primary'}`}>
                <span className="text-sm font-black uppercase tracking-widest">Accueil</span>
                <LayoutGrid size={20} />
              </Link>
              <Link to="/nos-combats" onClick={() => setIsOpen(false)} className={`flex items-center justify-between p-6 rounded-3xl transition-all ${location.pathname === '/nos-combats' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-background-alt text-foreground-muted hover:bg-primary/5 hover:text-primary'}`}>
                <span className="text-sm font-black uppercase tracking-widest">Nos Combats</span>
                <ShieldCheck size={20} />
              </Link>
              <Link to="/actualites" onClick={() => setIsOpen(false)} className={`flex items-center justify-between p-6 rounded-3xl transition-all ${location.pathname === '/actualites' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-background-alt text-foreground-muted hover:bg-primary/5 hover:text-primary'}`}>
                <span className="text-sm font-black uppercase tracking-widest">Actualités</span>
                <Newspaper size={20} />
              </Link>
              <Link to="/espace-donateur" onClick={() => setIsOpen(false)} className={`flex items-center justify-between p-6 rounded-3xl transition-all ${location.pathname === '/espace-donateur' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-background-alt text-foreground-muted hover:bg-primary/5 hover:text-primary'}`}>
                <span className="text-sm font-black uppercase tracking-widest">Faire un don</span>
                <Heart size={20} />
              </Link>
              {user && (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-6 rounded-3xl bg-background-alt text-foreground-muted font-black uppercase tracking-widest text-sm">
                  <span>Dashboard</span>
                  <ShieldCheck size={20} />
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {!user ? (
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-3 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[11px] py-6 rounded-[30px] shadow-2xl shadow-black/10 hover:bg-primary transition-all group">
                  Connexion <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-3 bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[11px] py-6 rounded-[30px] shadow-lg shadow-red-500/20"
                >
                  Déconnexion <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
