import React from 'react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Filter,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { storage } from '@/lib/store';
import { Transaction, FinancialCategory } from '@/lib/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const EconomicModel = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>(storage.getTransactions());
  const [categories] = React.useState<FinancialCategory[]>(storage.getFinancialCategories());
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const { status } = storage.getSubscriptionStatus();
  
  const [newTransaction, setNewTransaction] = React.useState<Partial<Transaction>>({
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    categoryId: '',
    description: ''
  });

  const handleAddTransaction = () => {
    if (status === 'expired') {
      toast.error('Votre abonnement est expiré. Veuillez souscrire à une offre pour continuer.');
      setIsAddOpen(false);
      return;
    }

    if (!newTransaction.amount || !newTransaction.categoryId || !newTransaction.date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: Number(newTransaction.amount),
      date: newTransaction.date as string,
      type: newTransaction.type as 'income' | 'expense',
      categoryId: newTransaction.categoryId as string,
      description: newTransaction.description || ''
    };

    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
    
    setIsAddOpen(false);
    setNewTransaction({
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      categoryId: '',
      description: ''
    });
    
    toast.success('Transaction ajoutée avec succès');
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
    toast.success('Transaction supprimée');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Inconnue';
  };

  const filteredCategories = categories.filter(c => c.type === newTransaction.type);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Modèle Économique</h1>
          <p className="text-slate-500">Gérez les finances, les revenus et les dépenses de l'association.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus size={18} /> Nouvelle Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une Transaction</DialogTitle>
              <DialogDescription>
                Enregistrez un nouveau mouvement financier dans le système.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Type de mouvement</Label>
                <div className="flex gap-4">
                  <Button 
                    type="button"
                    variant={newTransaction.type === 'income' ? 'default' : 'outline'}
                    className="flex-1 gap-2"
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income', categoryId: '' }))}
                  >
                    <ArrowUpRight size={16} /> Revenu
                  </Button>
                  <Button 
                    type="button"
                    variant={newTransaction.type === 'expense' ? 'destructive' : 'outline'}
                    className="flex-1 gap-2"
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
                  >
                    <ArrowDownRight size={16} /> Dépense
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Montant (FCFA)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="Ex: 50000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={newTransaction.categoryId} 
                  onValueChange={(v) => setNewTransaction(prev => ({ ...prev, categoryId: v }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optionnel)</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Cotisation annuelle bureau"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
              <Button onClick={handleAddTransaction} className="bg-blue-600 hover:bg-blue-700">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" /> Total Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {totalIncome.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Depuis le début</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingDown size={16} className="text-rose-500" /> Total Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {totalExpense.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Depuis le début</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-600 border-none shadow-md overflow-hidden text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
              <Wallet size={16} /> Solde Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">Fonds disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="income">Revenus</TabsTrigger>
            <TabsTrigger value="expense">Dépenses</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Filter size={14} /> Filtrer
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Download size={14} /> Exporter
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <TransactionTable 
            transactions={transactions} 
            onDelete={handleDeleteTransaction} 
            getCategoryName={getCategoryName}
          />
        </TabsContent>
        
        <TabsContent value="income" className="mt-0">
          <TransactionTable 
            transactions={transactions.filter(t => t.type === 'income')} 
            onDelete={handleDeleteTransaction}
            getCategoryName={getCategoryName}
          />
        </TabsContent>
        
        <TabsContent value="expense" className="mt-0">
          <TransactionTable 
            transactions={transactions.filter(t => t.type === 'expense')} 
            onDelete={handleDeleteTransaction}
            getCategoryName={getCategoryName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  getCategoryName: (id: string) => string;
}

const TransactionTable = ({ transactions, onDelete, getCategoryName }: TransactionTableProps) => {
  if (transactions.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-slate-50">
        <CardContent className="flex flex-col items-center justify-center py-10 text-slate-400">
          <Wallet className="w-12 h-12 mb-4 opacity-20" />
          <p>Aucune transaction enregistrée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id} className="group">
              <TableCell className="font-medium text-slate-600">
                {format(new Date(t.date), 'dd MMMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-slate-900 font-medium">{t.description || 'Sans description'}</span>
                  <span className="text-xs text-slate-400 md:hidden">{getCategoryName(t.categoryId)}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                  {getCategoryName(t.categoryId)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                  onClick={() => onDelete(t.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
