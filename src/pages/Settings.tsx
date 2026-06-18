import React from 'react';
import { Building, Mail, Phone, MapPin, Info, Save, Upload, Users, Trash2, Eye, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/store';
import { Association, Member } from '@/lib/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const Settings = () => {
  const [association, setAssociation] = React.useState<Association>(storage.getAssociation());
  const [members] = React.useState<Member[]>(storage.getMembers());
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssociation(prev => ({ ...prev, [name]: value }));
  };

  const handleBureauChange = (role: string, memberId: string) => {
    setAssociation(prev => ({
      ...prev,
      bureau: {
        ...(prev.bureau || {}),
        [role]: memberId === 'none' ? '' : memberId
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      storage.saveAssociation(association);
      toast.success("Informations de l'association mises à jour avec succès");
      // Trigger a custom event to notify other components (like Layout) that the association info has changed
      window.dispatchEvent(new Event('association-updated'));
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des informations');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez les informations de votre association et la composition du bureau.</p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Informations Générales
            </CardTitle>
            <CardDescription>
              Ces informations apparaîtront sur les reçus, les rapports et l'interface de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="space-y-4">
                <Label>Logo de l'Association</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {association.logo ? (
                      <img src={association.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAssociation(prev => ({ ...prev, logo: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload size={14} /> Modifier
                    </Button>
                    {association.logo && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setAssociation(prev => ({ ...prev, logo: '' }))}
                      >
                        <Trash2 size={14} /> Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 grid gap-4 w-full">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de l'Association</Label>
                  <Input
                    id="name"
                    name="name"
                    value={association.name}
                    onChange={handleChange}
                    placeholder="Ex: AKDM ASSOCIATION"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Slogan / Description Courte</Label>
                  <Input
                    id="description"
                    name="description"
                    value={association.description || ''}
                    onChange={handleChange}
                    placeholder="Ex: La gestion intelligente des associations"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={14} /> Email de Contact
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={association.email}
                  onChange={handleChange}
                  placeholder="contact@association.org"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone size={14} /> Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={association.phone}
                  onChange={handleChange}
                  placeholder="+225 ..."
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin size={14} /> Adresse Physique
              </Label>
              <Textarea
                id="address"
                name="address"
                value={association.address}
                onChange={handleChange}
                placeholder="Adresse complète du siège"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Aperçu du Branding Documentaire
            </CardTitle>
            <CardDescription>
              Voici comment votre logo et vos informations apparaîtront sur vos documents officiels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mini-Reçu</h4>
                <div className="bg-white border rounded-lg p-4 shadow-sm scale-90 origin-top-left">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {association.logo ? (
                        <img src={association.logo} alt="Logo" className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">{association.name[0]}</div>
                      )}
                      <span className="text-[10px] font-bold uppercase truncate max-w-[100px]">{association.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 italic">REÇU</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded mb-2" />
                  <div className="h-2 w-2/3 bg-slate-100 rounded mb-4" />
                  <div className="h-8 w-full bg-slate-900 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">En-tête de Rapport</h4>
                <div className="bg-white border rounded-lg p-4 shadow-sm scale-90 origin-top-left">
                  <div className="flex items-center gap-3 border-b pb-3 mb-3">
                    {association.logo ? (
                      <img src={association.logo} alt="Logo" className="w-10 h-10 object-contain" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">{association.name[0]}</div>
                    )}
                    <div className="flex-1">
                      <div className="h-3 w-3/4 bg-slate-200 rounded mb-1" />
                      <div className="h-2 w-1/2 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-50 rounded" />
                    <div className="h-2 w-full bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Composition du Bureau
            </CardTitle>
            <CardDescription>
              Désignez les membres occupant les postes clés de l'administration.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>Président(e)</Label>
              <Select 
                value={association.bureau?.presidentId || 'none'} 
                onValueChange={(v) => handleBureauChange('presidentId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Secrétaire Général(e)</Label>
              <Select 
                value={association.bureau?.secretaryId || 'none'} 
                onValueChange={(v) => handleBureauChange('secretaryId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Trésorier(e)</Label>
              <Select 
                value={association.bureau?.treasurerId || 'none'} 
                onValueChange={(v) => handleBureauChange('treasurerId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Commissaire aux comptes</Label>
              <Select 
                value={association.bureau?.auditorId || 'none'} 
                onValueChange={(v) => handleBureauChange('auditorId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2 px-8" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? 'Enregistrement...' : 'Enregistrer toutes les modifications'}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            À propos du système
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-600">Version de l'application</span>
            <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700">v1.2.0-beta</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-600">Dernière synchronisation</span>
            <span className="text-sm text-slate-700">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600">Type de stockage</span>
            <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">Local / Hors-ligne</span>
          </div>
          <div className="pt-4">
            <Button variant="outline" className="w-full gap-2" asChild>
              <Link to="/help">
                <LifeBuoy size={18} />
                Consulter le Centre d'aide complet
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
