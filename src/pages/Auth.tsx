import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';
import { storage } from '@/lib/store';
import { toast } from 'sonner';
import { ShieldCheck, UserCircle2, Eye, EyeOff, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LoginPage = () => {
  const navigate = useNavigate();
  const association = storage.getAssociation();
  const [identifier, setIdentifier] = React.useState('admin@association.org');
  const [password, setPassword] = React.useState('password');
  const [showPassword, setShowPassword] = React.useState(false);
  const [newAssocName, setNewAssocName] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');

  const handleLogin = (role: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN') => {
    let user;
    if (role === 'SUPER_ADMIN') {
      user = {
        id: 'super-admin-1',
        name: 'Super Admin AKDM',
        email: 'superadmin@akdm.com',
        role: 'SUPER_ADMIN'
      };
    } else {
      user = {
        id: role === 'ADMIN' ? 'admin-1' : '1',
        name: role === 'ADMIN' ? `Admin ${association.name}` : 'Jean Dupont',
        email: role === 'ADMIN' ? 'admin@association.org' : 'jean.dupont@example.com',
        role: role,
        photo: role === 'MEMBER' ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' : undefined
      };
    }
    
    storage.setCurrentUser(user);
    if (role === 'SUPER_ADMIN') {
      toast.success("Espace Super Administrateur AKDM");
      navigate('/super-admin');
    } else {
      toast.success(`Bienvenue, ${user.name}`);
      navigate(role === 'ADMIN' ? '/dashboard' : '/member-space');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssocName || !newEmail) return;

    storage.initializeNewAssociation(newAssocName, newEmail);
    handleLogin('ADMIN');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" 
         style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/835285ce-549f-4b3f-a5dd-c5cbc52d0e03/association-hero-04fc67cb-1780591645345.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {association.logo ? (
            <div className="w-20 h-20 bg-white p-2 rounded-2xl mx-auto mb-4 shadow-lg">
              <img src={association.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
              {association.name?.[0] || 'A'}
            </div>
          )}
          <h1 className="text-3xl font-bold text-white">{association.name}</h1>
          <p className="text-blue-100 mt-2">{association.description || '"La gestion intelligente des associations."'}</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-2xl">
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>Accédez à votre espace sécurisé</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email ou Téléphone</Label>
                  <Input 
                    id="identifier" 
                    type="text" 
                    placeholder="votre@email.com ou +225..." 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <InputGroup>
                    <InputGroupInput 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputGroupButton 
                      size="icon-sm" 
                      variant="ghost" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </InputGroupButton>
                  </InputGroup>
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      onClick={() => toast.info("Fonctionnalité de réinitialisation du mot de passe à venir")}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => handleLogin('ADMIN')}>
                  <ShieldCheck size={18} /> Se connecter comme Admin
                </Button>
                <Button variant="outline" className="w-full gap-2 border-slate-200" onClick={() => handleLogin('MEMBER')}>
                  <UserCircle2 size={18} /> Accès Membre
                </Button>
                <Button variant="ghost" className="w-full text-xs text-slate-400" onClick={() => handleLogin('SUPER_ADMIN')}>
                  Administration Plateforme AKDM
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-none shadow-2xl">
              <CardHeader>
                <CardTitle>Créer une association</CardTitle>
                <CardDescription>Bénéficiez de 90 jours d'essai gratuits</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assocName">Nom de l'Association</Label>
                    <Input 
                      id="assocName" 
                      placeholder="Ex: Club Sportif Dakar" 
                      value={newAssocName}
                      onChange={(e) => setNewAssocName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assocEmail">Email de l'Administrateur</Label>
                    <Input 
                      id="assocEmail" 
                      type="email" 
                      placeholder="admin@example.com" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                    <Building size={18} /> Créer mon compte & Commencer l'essai
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          &copy; {new Date().getFullYear()} {association.name}. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};
