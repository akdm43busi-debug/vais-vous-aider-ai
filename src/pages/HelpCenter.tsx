import React from 'react';
import { 
  LifeBuoy, 
  Info, 
  List, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  Mail, 
  Phone, 
  CheckCircle2,
  ChevronRight,
  Shield,
  FileText,
  Lock,
  Send,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const HelpCenter = () => {
  const [activeTab, setActiveTab] = React.useState('general');

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé avec succès. Notre équipe vous contactera sous peu.");
    (e.target as HTMLFormElement).reset();
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Le problème a été signalé avec succès. Merci de nous aider à améliorer l'application.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-blue-600" />
          Centre d'aide
        </h1>
        <p className="text-slate-500">Tout ce que vous devez savoir pour maîtriser AKDM ASSOCIATION.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-slate-100">
          <TabsTrigger value="general" className="gap-2 py-2">
            <Info size={16} />
            <span className="hidden md:inline">À propos</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2 py-2">
            <List size={16} />
            <span className="hidden md:inline">Fonctionnalités</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2 py-2">
            <HelpCircle size={16} />
            <span className="hidden md:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 py-2">
            <ShieldCheck size={16} />
            <span className="hidden md:inline">Sécurité & Légal</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="gap-2 py-2">
            <MessageSquare size={16} />
            <span className="hidden md:inline">Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>À propos de AKDM ASSOCIATION</CardTitle>
              <CardDescription>La plateforme de gestion moderne pour vos organisations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                <strong>AKDM ASSOCIATION</strong> est une plateforme numérique destinée à la gestion moderne des associations, coopératives, tontines, mutuelles, ONG et organisations communautaires.
              </p>
              <p>
                L'application permet de gérer les membres, les cotisations, les événements, les paiements, les reçus, les rapports et les communications dans un environnement sécurisé. Notre mission est de simplifier l'administration de vos groupements pour vous permettre de vous concentrer sur vos objectifs sociaux et communautaires.
              </p>
              
              <div className="pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Version</p>
                    <p className="text-sm font-medium">1.2.0-beta</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Mise à jour</p>
                    <p className="text-sm font-medium">15 Mai 2024</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Développeur</p>
                    <p className="text-sm font-medium">AKESSE KOUADIO DIDIA MARTIAL</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Copyright</p>
                    <p className="text-sm font-medium">© 2024 AKDM ASSOCIATION</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités détaillées</CardTitle>
              <CardDescription>Découvrez tout ce que vous pouvez faire avec AKDM ASSOCIATION.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Gestion des membres", desc: "Suivi complet des fiches membres et de leur historique." },
                  { title: "Gestion des cotisations", desc: "Suivi des paiements récurrents et exceptionnels." },
                  { title: "Gestion des événements", desc: "Organisation de réunions, AG et événements communautaires." },
                  { title: "Paiements Mobile Money", desc: "Intégration des paiements via mobile pour plus de facilité." },
                  { title: "Reçus PDF", desc: "Génération automatique de reçus professionnels pour chaque transaction." },
                  { title: "Notifications SMS", desc: "Envoi d'alertes et de rappels directement sur les téléphones." },
                  { title: "Notifications WhatsApp", desc: "Communication fluide via le canal de messagerie préféré." },
                  { title: "Rapports financiers", desc: "Tableaux de bord et exports détaillés de la santé financière." },
                  { title: "Gestion multi-associations", desc: "Gérez plusieurs organisations avec un seul compte administrateur." },
                  { title: "Carte numérique de membre", desc: "Cartes d'identité numériques avec QR Code pour les membres." },
                  { title: "Messagerie interne", desc: "Système de discussion sécurisé entre les membres." },
                  { title: "Appels audio et vidéo", desc: "Réunions virtuelles intégrées (disponible en version premium)." },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes (FAQ)</CardTitle>
              <CardDescription>Trouvez rapidement des réponses aux questions les plus courantes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Comment ajouter un membre ?</AccordionTrigger>
                  <AccordionContent>
                    Depuis le menu <strong>Membres</strong>, cliquez sur le bouton <strong>"Ajouter un membre"</strong> en haut à droite, puis remplissez le formulaire avec les informations du membre. N'oubliez pas de cliquer sur "Enregistrer".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Comment enregistrer une cotisation ?</AccordionTrigger>
                  <AccordionContent>
                    Depuis le menu <strong>Cotisations</strong> ou <strong>Paiements</strong>, sélectionnez le membre concerné, saisissez le montant de la cotisation et le motif, puis validez la transaction.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Comment télécharger un reçu ?</AccordionTrigger>
                  <AccordionContent>
                    Ouvrez le paiement concerné dans l'historique des transactions, puis cliquez sur le bouton <strong>"Télécharger le reçu PDF"</strong> ou sur l'icône de téléchargement correspondante.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Comment modifier les informations d'un membre ?</AccordionTrigger>
                  <AccordionContent>
                    Accédez à la liste des membres, recherchez le membre souhaité, ouvrez sa fiche détaillée, puis cliquez sur le bouton <strong>"Modifier"</strong>. Effectuez vos changements et enregistrez.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Comment renouveler un abonnement ?</AccordionTrigger>
                  <AccordionContent>
                    Accédez au menu <strong>Paramètres</strong>, puis cliquez sur la section <strong>"Mon abonnement"</strong> (ou "Finances"). Vous y trouverez les options pour prolonger votre accès au service.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Authentification sécurisée avec gestion des sessions.",
                    "Chiffrement des données sensibles (AES-256).",
                    "Sauvegardes automatiques quotidiennes des bases de données.",
                    "Contrôle des accès basé sur les rôles (Admin, Trésorier, Membre).",
                    "Isolation stricte des données par association.",
                    "Déconnexion sécurisée automatique en cas d'inactivité."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <ChevronRight size={14} className="mt-1 text-slate-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Politique de confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Les données appartiennent exclusivement aux associations.",
                    "Les données ne sont jamais vendues à des tiers.",
                    "Les informations sont stockées sur des serveurs sécurisés certifiés.",
                    "Les mots de passe sont hachés et chiffrés.",
                    "Les utilisateurs peuvent demander la suppression définitive de leurs données."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <ChevronRight size={14} className="mt-1 text-slate-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  Conditions d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    {[
                      "Respect strict des lois et réglementations en vigueur.",
                      "Responsabilité partagée des administrateurs pour la véracité des données.",
                      "Utilisation conforme de la plateforme aux buts de l'association."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight size={14} className="mt-1 text-slate-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-3">
                    {[
                      "Interdiction formelle de fraude ou d'usurpation d'identité.",
                      "Droit de suspension immédiate du compte en cas d'abus constaté.",
                      "Mises à jour régulières des conditions d'utilisation."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight size={14} className="mt-1 text-slate-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contacter le Support</CardTitle>
                <CardDescription>Une question ? Un besoin spécifique ? Nous sommes là pour vous.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <a 
                    href="https://wa.me/2250546765300" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">WhatsApp</p>
                      <p className="text-sm text-green-700">+225 05 46 76 53 00</p>
                    </div>
                  </a>

                  <a href="tel:+2250546765300" className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Téléphone</p>
                      <p className="text-sm text-blue-700">+225 05 46 76 53 00</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center text-white">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-700">support@akdm-association.com</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="support-subject">Sujet de votre message</Label>
                    <Input id="support-subject" placeholder="Ex: Problème d'accès" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="support-message">Votre message</Label>
                    <Textarea id="support-message" placeholder="Détaillez votre demande ici..." className="min-h-[100px]" required />
                  </div>
                  <Button type="submit" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                    <Send size={16} /> Envoyer la demande
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Signaler un problème
                </CardTitle>
                <CardDescription>Aidez-nous à améliorer la plateforme en signalant les bugs.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bug-title">Titre du problème</Label>
                    <Input id="bug-title" placeholder="Ex: Erreur lors du téléchargement d'un reçu" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bug-urgency">Niveau d'urgence</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="bug-urgency">
                        <SelectValue placeholder="Sélectionnez l'urgence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible - Amélioration suggérée</SelectItem>
                        <SelectItem value="medium">Moyenne - Gêne l'utilisation</SelectItem>
                        <SelectItem value="high">Haute - Bloque une fonctionnalité</SelectItem>
                        <SelectItem value="critical">Critique - Application inaccessible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bug-desc">Description détaillée</Label>
                    <Textarea id="bug-desc" placeholder="Que s'est-il passé ? Comment reproduire l'erreur ?" className="min-h-[120px]" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bug-file">Capture d'écran (optionnel)</Label>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="outline" className="gap-2 w-full" onClick={() => document.getElementById('bug-file')?.click()}>
                        <Upload size={16} /> Choisir une image
                      </Button>
                      <input id="bug-file" type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>
                  <Button type="submit" variant="destructive" className="w-full gap-2">
                    Signaler au support AKDM
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
