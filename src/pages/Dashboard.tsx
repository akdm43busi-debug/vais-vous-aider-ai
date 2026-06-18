import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  AlertCircle,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  MessageSquare,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { storage } from '@/lib/store';

export const Dashboard = () => {
  const navigate = useNavigate();
  const members = storage.getMembers();
  const contributions = storage.getContributions();
  const payments = storage.getPayments();
  const messages = storage.getMessages().slice(-3).reverse();
  const { status, daysRemaining } = storage.getSubscriptionStatus();
  
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    latePayments: contributions.filter(c => c.status === 'en_retard').length,
    totalCollected: contributions
      .filter(c => c.status === 'payé')
      .reduce((sum, c) => sum + c.amount, 0),
  };

  const handleLogout = () => {
    storage.logout();
    navigate('/login');
  };

  const chartData = [
    { name: 'Jan', height: '40%' },
    { name: 'Fév', height: '60%' },
    { name: 'Mar', height: '80%' },
    { name: 'Avr', height: '85%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500">Vue d'ensemble de l'activité de votre association.</p>
        </div>
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 border-red-200" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {status === 'trial' && (
          <Card className="col-span-full border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">
                      Bienvenue sur AKDM ASSOCIATION
                    </h3>
                    <p className="text-sm text-blue-700">
                      Vous bénéficiez de 90 jours d'essai gratuits pour découvrir toutes les fonctionnalités.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-sm font-medium text-blue-900">
                    <span>Essai gratuit</span>
                    <span>{daysRemaining} jours restants</span>
                  </div>
                  <Progress value={(daysRemaining / 90) * 100} className="h-2 bg-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <StatCard 
          title="Membres Totaux" 
          value={stats.totalMembers} 
          icon={<Users className="text-blue-600" />} 
          trend="+2 ce mois"
          trendUp={true}
        />
        <StatCard 
          title="Membres Actifs" 
          value={stats.activeMembers} 
          icon={<ShieldCheckIcon className="text-green-600" />} 
          trend="85% du total"
        />
        <StatCard 
          title="Cotisations Collectées" 
          value={`${stats.totalCollected.toLocaleString()} CFA`} 
          icon={<CreditCard className="text-blue-600" />} 
          trend="+15% vs mois dernier"
          trendUp={true}
        />
        <StatCard 
          title="En Retard" 
          value={stats.latePayments} 
          icon={<AlertCircle className="text-red-600" />} 
          trend="À relancer"
          trendUp={false}
          isWarning={stats.latePayments > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Évolution des Recettes (CFA)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6 pb-8">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-blue-500/20 group-hover:bg-blue-500/30 rounded-t-md transition-all relative overflow-hidden"
                  style={{ height: data.height }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-blue-600 opacity-80" />
                </div>
                <span className="text-xs font-medium text-slate-500">{data.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Messages récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-4">Aucun message récent</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="flex gap-3 items-start p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/messages')}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-xs">
                      {msg.senderId === '1' ? 'Moi' : 'M'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{msg.senderId === '1' ? 'Moi' : 'Membre'}</span>
                        <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-slate-600 truncate">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-4 bg-slate-900 gap-2" size="sm" onClick={() => navigate('/messages')}>
              <MessageSquare size={14} /> Nouveau message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp, isWarning }: any) => (
  <Card className={isWarning ? 'border-red-100 bg-red-50/30' : ''}>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend && (
          <span className={`text-xs mt-1 flex items-center gap-1 ${trendUp ? 'text-green-600' : trendUp === false ? 'text-red-600' : 'text-slate-400'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : trendUp === false ? <ArrowDownRight size={12} /> : null}
            {trend}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
