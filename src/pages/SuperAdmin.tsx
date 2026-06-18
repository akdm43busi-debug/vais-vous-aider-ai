import React from 'react';
import { 
  Users, 
  Building, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  Wallet, 
  Search,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 400000 },
  { name: 'Feb', revenue: 300000 },
  { name: 'Mar', revenue: 600000 },
  { name: 'Apr', revenue: 800000 },
  { name: 'May', revenue: 500000 },
  { name: 'Jun', revenue: 850000 },
];

export const SuperAdmin = () => {
  const stats = storage.getSuperAdminStats();
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Super Admin Dashboard</h1>
          <p className="text-slate-500">Vue d'ensemble de la plateforme AKDM ASSOCIATION.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            Exporter Rapport
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Configuration Système
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-blue-100 bg-blue-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Associations</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssociations}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight size={12} /> +12%
              </span> 
              depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card className="border-orange-100 bg-orange-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Associations en Essai</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trialAssociations}</div>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round((stats.trialAssociations / stats.totalAssociations) * 100)}% de la base totale
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-100 bg-green-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Revenus Totaux (FCFA)</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight size={12} /> +8.4%
              </span> 
              croissance mensuelle
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Évolution des Revenus
            </CardTitle>
            <CardDescription>Performance financière sur les 6 derniers mois.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              Répartition des Statuts
            </CardTitle>
            <CardDescription>État des abonnements actuels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 size={14} className="text-green-500" />
                  Actives / Payantes
                </span>
                <span className="font-bold">{stats.activeAssociations}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(stats.activeAssociations / stats.totalAssociations) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <Clock size={14} className="text-orange-500" />
                  Période d'Essai
                </span>
                <span className="font-bold">{stats.trialAssociations}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: `${(stats.trialAssociations / stats.totalAssociations) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <XCircle size={14} className="text-red-500" />
                  Expirées
                </span>
                <span className="font-bold">{stats.expiredAssociations}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${(stats.expiredAssociations / stats.totalAssociations) * 100}%` }} 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <AlertCircle size={16} />
                  Commissions AKDM
                </div>
                <div className="text-blue-900 font-black">
                  {stats.totalCommissions.toLocaleString()} FCFA
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Associations Récentes</CardTitle>
            <CardDescription>Liste des dernières inscriptions sur la plateforme.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Rechercher..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Association</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentAssociations.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((assoc) => (
                <TableRow key={assoc.id}>
                  <TableCell className="font-medium">{assoc.name}</TableCell>
                  <TableCell>{assoc.joinDate}</TableCell>
                  <TableCell className="capitalize">{assoc.plan}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={
                        assoc.status === 'active' || assoc.status === 'trial'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }
                    >
                      {assoc.status === 'trial' ? 'En essai' : assoc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
