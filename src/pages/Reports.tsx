import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Table as TableIcon, 
  PieChart, 
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export const Reports = () => {
  const association = storage.getAssociation();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<any>(null);

  const exportToExcel = async () => {
    toast.info("L'export Excel nécessite l'installation des dépendances manquantes.");
  };

  const handlePreview = (report: any) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const reports = [
    { title: "Rapport des Cotisations", desc: "Historique complet des paiements mensuels et annuels.", icon: FileText, color: "bg-blue-50 text-blue-600" },
    { title: "Liste des Membres", desc: "Coordonnées et statut d'adhésion de tous les membres.", icon: TableIcon, color: "bg-green-50 text-green-600", action: exportToExcel },
    { title: "Bilan Annuel", desc: "Statistiques financières et graphiques d'évolution.", icon: PieChart, color: "bg-purple-50 text-purple-600" },
    { title: "Retards de Paiement", desc: "Liste détaillée des membres en retard de cotisation.", icon: BarChart3, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rapports & Statistiques</h1>
        <p className="text-slate-500">Générez des rapports PDF et Excel pour votre comptabilité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`p-3 rounded-xl ${report.color}`}>
                <report.icon size={24} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">{report.desc}</p>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end gap-3 border-t border-slate-50 pt-4">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => handlePreview(report)}>
                <PieChart size={16} /> Aperçu
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={report.action || (() => toast.success("PDF généré"))}>
                <Download size={16} /> {report.action ? 'Excel' : 'PDF'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration des Rapports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Fréquence d'envoi</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200">Hebdo</Button>
                <Button variant="outline" size="sm">Mensuel</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Destinataires</label>
              <p className="text-xs text-slate-500">Bureau exécutif, Trésorier</p>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-slate-900">Planifier l'envoi</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du Rapport</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 bg-white border rounded-lg">
            <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-6">
              <div className="flex items-center gap-4">
                {association.logo ? (
                  <img src={association.logo} alt="Logo" className="w-16 h-16 object-contain" />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl">
                    {association.name[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{association.name}</h2>
                  <p className="text-sm text-slate-500 font-medium">{association.description}</p>
                  <p className="text-xs text-slate-400">{association.address} | {association.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-black text-slate-200 uppercase tracking-widest">RAPPORT</h1>
                <p className="text-sm font-bold text-slate-900">{selectedReport?.title}</p>
                <p className="text-xs text-slate-500">Date d'extraction: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 flex-col gap-2">
                <BarChart3 size={48} className="opacity-20" />
                <p className="text-sm font-medium italic">Visualisation des données réelles en cours de génération...</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Annuler</Button>
            <Button className="bg-slate-900" onClick={() => { toast.success("Impression du rapport..."); setIsPreviewOpen(false); }}>Imprimer le Rapport</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
