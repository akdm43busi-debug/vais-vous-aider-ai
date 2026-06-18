import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  FileText, 
  Bell, 
  User, 
  LogOut,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Settings,
  MessageSquare,
  LifeBuoy,
  CreditCard as SubscriptionIcon,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [association, setAssociation] = React.useState(storage.getAssociation());
  const location = useLocation();
  const navigate = useNavigate();
  const user = storage.getCurrentUser();

  React.useEffect(() => {
    const handleUpdate = () => {
      setAssociation(storage.getAssociation());
    };
    window.addEventListener('association-updated', handleUpdate);
    return () => window.removeEventListener('association-updated', handleUpdate);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'TREASURER';
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  React.useEffect(() => {
    const { status, daysRemaining } = storage.getSubscriptionStatus();
    if (status === 'trial' && [7, 3, 1].includes(daysRemaining)) {
      toast.warning(
        `Votre période d'essai AKDM ASSOCIATION expire dans ${daysRemaining} jours. Renouvelez votre abonnement pour continuer à utiliser la plateforme.`,
        {
          duration: 10000,
          action: { label: 'Renouveler', onClick: () => navigate('/subscriptions') }
        }
      );
    }
  }, [navigate]);

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, show: isAdmin },
    { name: 'Membres', href: '/members', icon: Users, show: isAdmin },
    { name: 'Cotisations', href: '/contributions', icon: CreditCard, show: isAdmin },
    { name: 'Réunions', href: '/meetings', icon: Calendar, show: true },
    { name: 'Rapports', href: '/reports', icon: FileText, show: isAdmin },
    { name: 'Modèle Économique', href: '/finances', icon: BarChart3, show: isAdmin },
    { name: 'Messages', href: '/messages', icon: MessageSquare, show: true },
    { name: 'Paramètres', href: '/settings', icon: Settings, show: isAdmin },
    { name: 'Mon Espace', href: '/member-space', icon: User, show: true },
    { name: 'Abonnement', href: '/subscriptions', icon: SubscriptionIcon, show: isAdmin },
    { name: 'Super Admin', href: '/super-admin', icon: ShieldCheck, show: isSuperAdmin },
    { name: "Centre d'aide", href: '/help', icon: LifeBuoy, show: true },
  ];

  const handleLogout = () => {
    storage.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          {association.logo ? (
            <img src={association.logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {association.name?.[0] || 'A'}
            </div>
          )}
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">{association.name.split(' ')[0]}</h1>
            <p className="text-xs text-slate-500">{association.name.split(' ').slice(1).join(' ')}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.filter(item => item.show).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
              {location.pathname === item.href && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.photo} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {association.logo ? (
              <img src={association.logo} alt="Logo" className="w-8 h-8 object-contain rounded-md" />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                {association.name?.[0] || 'A'}
              </div>
            )}
            <span className="font-bold">{association.name.split(' ')[0]}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </Button>
        </header>

        {/* Mobile Nav Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative w-full max-w-xs bg-white h-full flex flex-col">
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <span className="font-bold text-sm truncate">{association.name}</span>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <X size={24} />
                </Button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navigation.filter(item => item.show).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    <item.icon size={22} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-100">
                <Button variant="outline" className="w-full justify-center gap-2 text-red-600" onClick={handleLogout}>
                  <LogOut size={18} /> Déconnexion
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
