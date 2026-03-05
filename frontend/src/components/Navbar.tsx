import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, Heart, ShieldCheck, LayoutGrid, Newspaper } from 'lucide-react';
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

      <nav className={`sticky top-0 sm:top-6 z-[100] transition-all duration-500 max-w-[1400px] mx-auto px-4 sm:px-6`}>
        <div className={`rounded-b-3xl sm:rounded-3xl border transition-all duration-300 ${scrolled
          ? 'bg-background/80 backdrop-blur-2xl py-3 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-border sm:-translate-y-2'
          : 'bg-background py-4 sm:py-5 px-5 sm:px-8 shadow-sm border-border'
          }`}>
          <div className="flex justify-between items-center h-12">

            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center group shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-[14px] text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Heart size={20} className="fill-white" />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-xl font-black text-foreground leading-none tracking-tight transition-colors">ONG</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5 leading-none">IMPACT</span>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-2">
                <NavLink to="/" icon={LayoutGrid}>Accueil</NavLink>
                <NavLink to="/actualites" icon={Newspaper}>Actualités</NavLink>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <NavLink to="/dashboard" icon={ShieldCheck}>Dashboard</NavLink>

                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                      className="flex items-center gap-3 bg-background-alt pl-2 pr-4 py-1.5 rounded-full border border-border hover:bg-background hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-foreground tracking-tight whitespace-nowrap transition-colors">{user.name}</span>
                      <ChevronDown size={14} className={`text-foreground-muted transition-all duration-300 ${showUserMenu ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 w-64 mt-4 origin-top-right bg-background rounded-[30px] shadow-2xl py-3 border border-border animate-in fade-in zoom-in-95 duration-200 z-50 transition-colors">
                        <div className="px-6 py-4 border-b border-border mb-2 transition-colors">
                          <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-1 transition-colors">CONNECTÉ EN TANT QUE</p>
                          <p className="text-sm font-black text-foreground truncate transition-colors">{user.name}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center px-6 py-3 text-sm font-bold text-foreground-muted hover:bg-primary/10 hover:text-primary transition-all">
                          <LayoutGrid size={16} className="mr-3" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all text-left"
                        >
                          <LogOut size={16} className="mr-3" /> Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-foreground-muted hover:text-primary transition-all px-4">Connexion</Link>
                  <Link
                    to="/login"
                    className="bg-foreground text-background px-8 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10"
                  >
                    Rejoindre
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-background-alt rounded-2xl text-foreground-muted hover:text-primary focus:outline-none transition-all border border-border"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`lg:hidden fixed inset-x-4 top-24 z-[100] bg-background rounded-[40px] shadow-2xl border border-border p-8 transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
            }`}
        >
          <div className="space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-5 rounded-3xl bg-primary/10 text-primary font-black tracking-widest uppercase text-xs">
              <LayoutGrid size={18} /> Accueil
            </Link>
            <Link to="/actualites" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-5 rounded-3xl hover:bg-background-alt text-foreground-muted font-black tracking-widest uppercase text-xs transition-all">
              <Newspaper size={18} /> Actualités
            </Link>
            {user && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-5 rounded-3xl hover:bg-background-alt text-foreground-muted font-black tracking-widest uppercase text-xs transition-all">
                <ShieldCheck size={18} /> Dashboard
              </Link>
            )}

            <div className="pt-6 border-t border-border mt-6 flex flex-col gap-4">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-foreground text-background font-black uppercase tracking-widest py-5 rounded-[24px]">
                    SE CONNECTER
                  </Link>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center border border-border text-foreground font-black uppercase tracking-widest py-5 rounded-[24px]">
                    REJOINDRE
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-[24px] shadow-lg shadow-red-500/20"
                >
                  DÉCONNEXION
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
