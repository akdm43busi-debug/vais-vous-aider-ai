import React from 'react';
import { storage } from '@/lib/store';
import { Contribution, Member, Payment, ContributionCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Receipt,
  Settings2,
  Trash2,
  Edit2,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Contributions = () => {
  const [contributions, setContributions] = React.useState<Contribution[]>(storage.getContributions());
  const [members] = React.useState<Member[]>(storage.getMembers());
  const [categories, setCategories] = React.useState<ContributionCategory[]>(storage.getContributionCategories());
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [amount, setAmount] = React.useState<string>('');
  const [selectedContribution, setSelectedContribution] = React.useState<Contribution | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = React.useState(false);
  const association = storage.getAssociation();
  const { status: subStatus } = storage.getSubscriptionStatus();

  const getMemberName = (id: string) => {
    const m = members.find(member => member.id === id);
    return m ? `${m.firstName} ${m.lastName}` : 'Inconnu';
  };

  const filteredContributions = contributions.filter(c => 
    getMemberName(c.memberId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.period?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    const cat = categories.find(c => c.name === val);
    if (cat && cat.defaultAmount) {
      setAmount(cat.defaultAmount.toString());
    }
  };

  const handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (subStatus === 'expired') {
      toast.error('Votre abonnement est expiré. Veuillez souscrire à une offre pour continuer.');
      setIsAddModalOpen(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const memberId = formData.get('memberId') as string;
    const type = selectedCategory;
    const period = formData.get('period') as string;
    const finalAmount = Number(amount);

    if (!type || !memberId || !finalAmount) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newContribution: Contribution = {
      id: `c-${Date.now()}`,
      memberId,
      amount: finalAmount,
      type,
      date: new Date().toISOString().split('T')[0],
      status: 'payé',
      period
    };

    const updated = [newContribution, ...contributions];
    setContributions(updated);
    storage.saveContributions(updated);
    
    const payments = storage.getPayments();
    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      contributionId: newContribution.id,
      memberId,
      amount: finalAmount,
      paymentDate: new Date().toISOString(),
      method: 'espèces',
      transactionId: `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    storage.savePayments([...payments, newPayment]);

    setIsAddModalOpen(false);
    setSelectedCategory('');
    setAmount('');
    toast.success('Paiement enregistré avec succès');
  };

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const defaultAmount = Number(formData.get('defaultAmount'));

    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Cette catégorie existe déjà');
      return;
    }

    const newCategory: ContributionCategory = {
      id: `cat-${Date.now()}`,
      name,
      defaultAmount
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    storage.saveContributionCategories(updated);
    toast.success('Catégorie ajoutée');
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    storage.saveContributionCategories(updated);
    toast.success('Catégorie supprimée');
  };

  const handleShowReceipt = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cotisations & Paiements</h1>
          <p className="text-slate-500">Suivi financier et historique des paiements de l'association.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isManageCategoriesOpen} onOpenChange={setIsManageCategoriesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings2 size={18} /> Personnaliser
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Personnaliser les Cotisations</DialogTitle>
                <DialogDescription>
                  Gérez les types de cotisations et leurs montants par défaut.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <form onSubmit={handleAddCategory} className="space-y-4 p-4 border rounded-lg bg-slate-50">
                  <h4 className="font-semibold text-sm">Ajouter un nouveau type</h4>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cat-name">Nom du type</Label>
                      <Input id="cat-name" name="name" placeholder="Ex: Mariage, Naissance..." required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cat-amount">Montant suggéré (CFA)</Label>
                      <Input id="cat-amount" name="defaultAmount" type="number" placeholder="5000" />
                    </div>
                    <Button type="submit" size="sm" className="bg-blue-600">Ajouter</Button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Types existants</h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-medium text-sm">{cat.name}</p>
                          <p className="text-xs text-slate-500">{cat.defaultAmount?.toLocaleString()} CFA</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            if (open && subStatus === 'expired') {
              toast.error('Votre abonnement est expiré. Veuillez souscrire à une offre pour continuer.');
              return;
            }
            setIsAddModalOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                disabled={subStatus === 'expired'}
              >
                <Plus size={18} /> Nouveau Paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer un Paiement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPayment} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Membre</Label>
                  <Select name="memberId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.firstName} {m.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type de contribution</Label>
                    <Select onValueChange={handleCategoryChange} value={selectedCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Montant (CFA)</Label>
                    <Input 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      type="number" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Période / Description</Label>
                  <Input name="period" placeholder="ex: Mars 2024 ou Évènement..." required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                  <Button type="submit" className="bg-blue-600">Enregistrer le paiement</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Rechercher par membre, période ou type..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} /> Filtres
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Membre</TableHead>
                      <TableHead>Type & Période</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContributions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                          Aucun résultat trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContributions.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{getMemberName(c.memberId)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{c.type}</span>
                              <span className="text-xs text-slate-400">{c.period}</span>
                            </div>
                          </TableCell>
                          <TableCell>{c.amount.toLocaleString()} CFA</TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'payé' ? 'default' : 'destructive'} className={
                              c.status === 'payé' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                              c.status === 'en_retard' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                              'bg-orange-100 text-orange-700 hover:bg-orange-100'
                            }>
                              {c.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                <Edit2 size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-green-600"
                                onClick={() => handleShowReceipt(c)}
                              >
                                <Receipt size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400 font-bold">
                <Receipt size={20} />
                Résumé Financier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Collecté</p>
                <h3 className="text-3xl font-bold tracking-tight">
                  {contributions.filter(c => c.status === 'payé').reduce((s, c) => s + c.amount, 0).toLocaleString()} <span className="text-sm font-normal text-slate-400">CFA</span>
                </h3>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-xs mb-1">En Retard</p>
                  <p className="text-lg font-bold text-red-400">
                    {contributions.filter(c => c.status === 'en_retard').reduce((s, c) => s + c.amount, 0).toLocaleString()} <span className="text-xs font-normal">CFA</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs mb-1">Membres à jour</p>
                  <p className="text-lg font-bold text-green-400">
                    {Math.round((contributions.filter(c => c.status === 'payé').length / contributions.length || 0) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-orange-50/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-orange-600" size={20} />
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900">Relances nécessaires</h4>
                    <p className="text-sm text-slate-600">
                      Il y a {contributions.filter(c => c.status === 'en_retard').length} paiements en retard qui nécessitent une attention.
                    </p>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 w-full shadow-sm">
                    Envoyer des rappels SMS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="p-8 bg-white text-slate-900" id="receipt-content">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                {association.logo ? (
                  <img src={association.logo} alt="Logo" className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
                    {association.name[0]}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-lg leading-tight uppercase">{association.name}</h2>
                  <p className="text-[10px] text-slate-500">{association.address}</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-black text-slate-300 uppercase italic">REÇU</h1>
                <p className="text-[10px] font-mono">#{selectedContribution?.id.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Membre / Donateur</p>
                <p className="text-lg font-bold">{selectedContribution ? getMemberName(selectedContribution.memberId) : ''}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Type de paiement</p>
                  <p className="font-semibold">{selectedContribution?.type}</p>
                  <p className="text-xs text-slate-500">{selectedContribution?.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Date</p>
                  <p className="font-semibold">{selectedContribution?.date}</p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Montant Payé</p>
                  <p className="text-3xl font-black">{selectedContribution?.amount.toLocaleString()} <span className="text-sm font-normal text-slate-400">CFA</span></p>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-end">
                <div className="text-[10px] text-slate-400">
                  <p>Généré par {association.name}</p>
                  <p>{association.email} | {association.phone}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-12 border-b border-slate-200 mb-1"></div>
                  <p className="text-[10px] font-bold uppercase">Le Trésorier</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 bg-slate-50 border-t">
            <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>Fermer</Button>
            <Button className="bg-blue-600" onClick={() => { toast.success("Impression lancée..."); setIsReceiptOpen(false); }}>Imprimer le Reçu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
