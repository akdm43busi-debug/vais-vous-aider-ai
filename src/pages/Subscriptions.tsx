import React from 'react';
import { Check, CreditCard, Smartphone, ShieldCheck, Zap, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { storage } from '@/lib/store';
import { SubscriptionPlan } from '@/lib/types';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'decouverte' as SubscriptionPlan,
    name: 'Découverte',
    price: 1500,
    memberLimit: 50,
    features: [
      "Jusqu'à 50 membres",
      "Gestion des cotisations",
      "Reçus PDF de base",
      "Tableau de bord standard",
      "Notifications SMS & WhatsApp",
      "Support par email"
    ]
  },
  {
    id: 'standard' as SubscriptionPlan,
    name: 'Standard',
    price: 5000,
    memberLimit: 500,
    features: [
      "Jusqu'à 500 membres",
      "Tout de la version Découverte",
      "Rapports financiers avancés",
      "Gestion des administrateurs",
      "Export Excel & PDF illimité",
      "Support prioritaire 24/7",
      "Appels audio & vidéo"
    ],
    popular: true
  }
];

const PAYMENT_METHODS = [
  { id: 'orange', name: 'Orange Money', color: 'bg-[#FF6600]' },
  { id: 'mtn', name: 'MTN Money', color: 'bg-[#FFCC00]' },
  { id: 'moov', name: 'Moov Money', color: 'bg-[#0066CC]' },
  { id: 'wave', name: 'Wave', color: 'bg-[#0099FF]' }
];

export const Subscriptions = () => {
  const { status, daysRemaining, plan } = storage.getSubscriptionStatus();
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan>(plan || 'decouverte');
  const [selectedMethod, setSelectedMethod] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubscribe = () => {
    if (!selectedMethod) {
      toast.error('Veuillez sélectionner un mode de paiement');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const currentAssoc = storage.getAssociation();
      const planDetails = PLANS.find(p => p.id === selectedPlan);
      
      const newSubscription = {
        plan: selectedPlan,
        status: 'active' as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        price: planDetails?.price || 0,
        memberLimit: planDetails?.memberLimit || 50,
        paymentMethod: selectedMethod,
        autoRenew: true
      };

      storage.saveAssociation({
        ...currentAssoc,
        subscription: newSubscription
      });

      toast.success(`Abonnement ${planDetails?.name} activé avec succès !`);
      setIsProcessing(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Abonnement</h1>
        <p className="text-slate-500">Choisissez la formule qui convient le mieux à votre association.</p>
      </div>

      {status === 'expired' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-bold text-red-900">Votre période d'essai est terminée</h3>
              <p className="text-sm text-red-700">Choisissez une formule pour continuer à utiliser toutes les fonctionnalités de AKDM ASSOCIATION.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'trial' && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-bold text-blue-900">Période d'essai en cours</h3>
                <p className="text-sm text-blue-700">Il vous reste {daysRemaining} jours de test gratuit.</p>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700 font-bold uppercase">
                Essai Gratuit
              </Badge>
            </div>
            <Progress value={(daysRemaining / 90) * 100} className="h-2 bg-blue-200" />
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
        {PLANS.map((p) => (
          <Card 
            key={p.id} 
            className={`relative flex flex-col cursor-pointer transition-all hover:shadow-lg ${
              selectedPlan === p.id ? 'ring-2 ring-blue-600 border-blue-600' : ''
            }`}
            onClick={() => setSelectedPlan(p.id)}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 hover:bg-blue-600 px-4">Plus populaire</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {p.name}
                {p.id === plan && status === 'active' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Actif</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-slate-900 pt-2">
                {p.price.toLocaleString()} FCFA <span className="text-sm font-normal text-slate-500">/ mois</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {p.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedPlan === p.id ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setSelectedPlan(p.id)}
              >
                {selectedPlan === p.id ? 'Sélectionné' : 'Choisir ce plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Mode de Paiement
          </CardTitle>
          <CardDescription>
            Sélectionnez votre opérateur de Mobile Money préféré.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedMethod === m.id 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 ${m.color} rounded-lg flex items-center justify-center text-white font-black`}>
                <Smartphone size={24} />
              </div>
              <span className="text-xs font-bold uppercase">{m.name}</span>
            </button>
          ))}
        </CardContent>
        <CardFooter className="bg-slate-50 rounded-b-xl border-t border-slate-100 py-6 mt-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full border border-slate-200 text-slate-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Paiement 100% Sécurisé</p>
                <p className="text-xs text-slate-500 text-left">Vos transactions sont protégées par chiffrement.</p>
              </div>
            </div>
            <Button 
              className="w-full md:w-auto px-12 h-12 bg-blue-600 hover:bg-blue-700 gap-2"
              disabled={isProcessing}
              onClick={handleSubscribe}
            >
              {isProcessing ? (
                <>Traitement en cours...</>
              ) : (
                <>
                  <Zap size={18} fill="currentColor" />
                  Activer mon abonnement
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex items-center gap-8 opacity-50 grayscale">
          {['Orange', 'MTN', 'Moov', 'Wave'].map((brand) => (
            <span key={brand} className="text-sm font-black italic">{brand} MONEY</span>
          ))}
        </div>
        <p className="text-xs text-slate-400">© 2024 AKDM ASSOCIATION - Tous droits réservés</p>
      </div>
    </div>
  );
};
