import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/store';
import { Contribution, Member, Payment, Notification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  History, 
  Bell, 
  Download, 
  User as UserIcon,
  ShieldCheck,
  Calendar,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

export const MemberSpace = () => {
  const navigate = useNavigate();
  const user = storage.getCurrentUser();
  const allMembers = storage.getMembers();
  const member = allMembers.find(m => m.email === user?.email);
  const contributions = storage.getContributions().filter(c => c.memberId === member?.id);
  const notifications = storage.getNotifications(member?.id);

  const handleLogout = () => {
    storage.logout();
    navigate('/login');
  };

  if (!member) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-48 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 gap-2 backdrop-blur-sm" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </Button>
        </div>
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-6 left-8 flex items-end gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
              <AvatarImage src={member.photo} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                {member.firstName[0]}{member.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white" />
          </div>
          <div className="pb-2 text-white">
            <h1 className="text-2xl font-bold">{member.firstName} {member.lastName}</h1>
            <p className="text-blue-100 opacity-90">{member.profession}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="text-blue-600" /> Mes Cotisations
              </h2>
              <Button variant="outline" size="sm">Voir tout</Button>
            </div>
            <div className="grid gap-4">
              {contributions.length > 0 ? (
                contributions.map(c => (
                  <Card key={c.id} className="hover:border-blue-200 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${c.status === 'payé' ? 'bg-green-50' : 'bg-red-50'}`}>
                          <ShieldCheck className={c.status === 'payé' ? 'text-green-600' : 'text-red-600'} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{c.period}</p>
                          <p className="text-xs text-slate-500 capitalize">{c.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{c.amount.toLocaleString()} CFA</p>
                        <Badge className={`mt-1 ${c.status === 'payé' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {c.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {c.status === 'payé' && (
                        <Button variant="ghost" size="icon" onClick={() => toast.success("Téléchargement du reçu...")}>
                          <Download size={18} />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
                  Aucune cotisation enregistrée.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600" /> Agenda Personnel
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg min-w-[70px]">
                    <span className="text-blue-600 font-bold text-xl">15</span>
                    <span className="text-blue-400 text-[10px] uppercase font-bold">AVRIL</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Assemblée Générale Annuelle</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Votre présence est requise pour le vote du bureau.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm mt-2">Confirmer ma présence</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="text-blue-600" /> Notifications
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { title: "Paiement Validé", text: "Votre cotisation de Mars a été validée par le trésorier.", time: "2h" },
                    { title: "Rappel AG", text: "N'oubliez pas l'AG prévue ce week-end.", time: "1j" },
                  ].map((n, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-blue-600 py-3">
                  Marquer tout comme lu
                </Button>
              </CardContent>
            </Card>
          </section>

          <Card className="bg-slate-900 text-white border-none">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-4 opacity-50" />
              <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Contactez le secrétariat de l'association pour toute question administrative.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Contacter le bureau</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};