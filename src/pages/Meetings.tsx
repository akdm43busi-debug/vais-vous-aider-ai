import React from 'react';
import { storage } from '@/lib/store';
import { Meeting } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  ChevronRight,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const Meetings = () => {
  const [meetings] = React.useState<Meeting[]>(storage.getMeetings());
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { status } = storage.getSubscriptionStatus();

  const upcomingMeetings = meetings.filter(m => m.status === 'prévue');
  const pastMeetings = meetings.filter(m => m.status === 'terminée');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Réunions & Évènements</h1>
          <p className="text-slate-500">Planifiez vos AG et gérez les présences.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          onClick={() => status === 'expired' ? toast.error('Votre abonnement est expiré.') : toast.info('Bientôt disponible')}
          disabled={status === 'expired'}
        >
          <Plus size={18} /> Nouvelle Réunion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={20} /> Prochainement
            </h2>
            <div className="grid gap-4">
              {upcomingMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
              {upcomingMeetings.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
                  Aucune réunion prévue.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-slate-400" size={20} /> Historique
            </h2>
            <div className="grid gap-4">
              {pastMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Convocations Automatiques</h3>
            <p className="text-sm text-blue-700 mb-4">
              Envoyez des convocations par email, SMS et WhatsApp à tous les membres en un clic.
            </p>
            <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-600 hover:bg-blue-50">
              Paramétrer les messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:border-blue-200 transition-colors">
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg min-w-[100px]">
      <span className="text-blue-600 font-bold text-2xl">
        {new Date(meeting.date).getDate()}
      </span>
      <span className="text-slate-500 text-xs uppercase font-medium">
        {new Date(meeting.date).toLocaleDateString('fr-FR', { month: 'short' })}
      </span>
    </div>
    <div className="flex-1 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <Badge className={meeting.status === 'prévue' ? 'bg-blue-100 text-blue-700 border-none' : 'bg-slate-100 text-slate-700 border-none'}>
            {meeting.status}
          </Badge>
          <h3 className="font-bold text-lg text-slate-900 mt-2">{meeting.title}</h3>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical size={18} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={16} className="text-slate-400" />
          {meeting.location}
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Clock size={16} className="text-slate-400" />
          {new Date(meeting.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Users size={16} className="text-slate-400" />
          {meeting.attendees.length} participants inscrits
        </div>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2">{meeting.description}</p>
    </div>
    <div className="flex items-center justify-end">
      <Button variant="ghost" className="gap-2 text-blue-600">
        Détails <ChevronRight size={16} />
      </Button>
    </div>
  </div>
);
