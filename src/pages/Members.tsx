import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/store';
import { Member } from '@/lib/types';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Filter
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Members = () => {
  const [members, setMembers] = React.useState<Member[]>(storage.getMembers());
  const [searchTerm, setSearchTerm] = React.useState('');
  const { status, memberLimit } = storage.getSubscriptionStatus();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === 'expired') {
      toast.error('Votre abonnement est expiré. Veuillez souscrire à une offre pour continuer.');
      setIsAddModalOpen(false);
      return;
    }

    if (members.length >= memberLimit) {
      toast.error(`Vous avez atteint la limite de ${memberLimit} membres pour votre forfait actuel.`);
      setIsAddModalOpen(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newMember: Member = {
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      profession: formData.get('profession') as string,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const updated = [...members, newMember];
    setMembers(updated);
    storage.saveMembers(updated);
    setIsAddModalOpen(false);
    toast.success('Membre ajouté avec succès');
  };

  const toggleStatus = (id: string) => {
    const updated = members.map(m => 
      m.id === id ? { ...m, status: (m.status === 'active' ? 'inactive' : 'active') as any } : m
    );
    setMembers(updated);
    storage.saveMembers(updated);
    toast.info('Statut mis à jour');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Membres</h1>
          <p className="text-slate-500">Gérez la liste des membres et leurs informations.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          if (open && status === 'expired') {
            toast.error('Votre abonnement est expiré.');
            return;
          }
          setIsAddModalOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" disabled={status === 'expired'}>
              <UserPlus size={18} /> Ajouter un Membre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouveau Membre</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" name="phone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" name="profession" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" name="address" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-blue-600">Enregistrer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Rechercher un membre (nom, email...)" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} /> Filtrer
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead>Adhésion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.photo} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-slate-500">ID: {member.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" /> {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" /> {member.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{member.profession}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">
                      {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={member.status === 'active' ? 'bg-green-100 text-green-700 border-none' : 'bg-slate-100 text-slate-700 border-none'}>
                      {member.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info('Modification bientôt disponible')}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(member.id)}>
                          {member.status === 'active' ? 'Désactiver' : 'Activer'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => toast.error('Action non autorisée')}>
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
