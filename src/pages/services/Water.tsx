
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Droplet, Save, BarChart4, Download, AreaChart, Calendar, Check, QrCode } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Water = () => {
  const [formData, setFormData] = useState({
    date: "",
    quantiteInitiale: "",
    quantiteProduite: "",
    quantiteDistribuee: "",
    typeProduit: "eau_plate",
    operateur: "",
    equipementUtilise: "machine1",
    qualite: "excellente",
    commentaires: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données du formulaire soumises:", formData);
    toast({
      title: "Données enregistrées",
      description: `Les données de production d'eau du ${formData.date} ont été enregistrées.`,
    });
  };

  // Données simulées pour les graphiques
  const productionData = [
    { jour: 'Lundi', produit: 4200, distribue: 3800, stock: 12500 },
    { jour: 'Mardi', produit: 4500, distribue: 4200, stock: 12800 },
    { jour: 'Mercredi', produit: 3800, distribue: 4000, stock: 12600 },
    { jour: 'Jeudi', produit: 4300, distribue: 4100, stock: 12800 },
    { jour: 'Vendredi', produit: 4700, distribue: 4300, stock: 13200 },
    { jour: 'Samedi', produit: 3500, distribue: 3900, stock: 12800 },
    { jour: 'Dimanche', produit: 2800, distribue: 3200, stock: 12400 },
  ];

  // Données de production par mois
  const monthlyData = [
    { mois: 'Jan', produit: 120000, objectif: 130000 },
    { mois: 'Fév', produit: 118000, objectif: 130000 },
    { mois: 'Mar', produit: 132000, objectif: 130000 },
    { mois: 'Avr', produit: 129000, objectif: 130000 },
    { mois: 'Mai', produit: 135000, objectif: 130000 },
    { mois: 'Jun', produit: 142000, objectif: 130000 },
  ];

  // Données des commandes d'eau
  const commandes = [
    { id: 1, client: "Hôtel Royal", produit: "Eau plate", quantite: "500 L", date: "2025-04-08", statut: "livrée" },
    { id: 2, client: "Restaurant Le Gourmet", produit: "Eau plate", quantite: "300 L", date: "2025-04-08", statut: "en cours" },
    { id: 3, client: "Salle de conférence", produit: "Eau gazeuse", quantite: "150 L", date: "2025-04-09", statut: "planifiée" },
    { id: 4, client: "Événement Gala", produit: "Eau plate + gazeuse", quantite: "800 L", date: "2025-04-15", statut: "planifiée" },
    { id: 5, client: "Centre sportif", produit: "Eau plate", quantite: "400 L", date: "2025-04-10", statut: "livrée" },
  ];

  return (
    <MainLayout title="Production d'eau">
      <Tabs defaultValue="production" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="production" className="bg-white">Saisie production</TabsTrigger>
          <TabsTrigger value="commandes" className="bg-white">Commandes</TabsTrigger>
          <TabsTrigger value="stats" className="bg-white">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-sky-500" />
                <CardTitle>Saisie de production d'eau</CardTitle>
              </div>
              <CardDescription>
                Enregistrez les données quotidiennes de production d'eau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="waterProductionForm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operateur">Opérateur responsable</Label>
                    <Input 
                      id="operateur"
                      name="operateur"
                      placeholder="Nom de l'opérateur"
                      value={formData.operateur}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantiteInitiale">Stock initial (L)</Label>
                    <Input 
                      id="quantiteInitiale"
                      name="quantiteInitiale"
                      type="number"
                      min="0"
                      placeholder="Ex: 12500"
                      value={formData.quantiteInitiale}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantiteProduite">Quantité produite (L)</Label>
                    <Input 
                      id="quantiteProduite"
                      name="quantiteProduite"
                      type="number"
                      min="0"
                      placeholder="Ex: 4200"
                      value={formData.quantiteProduite}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantiteDistribuee">Quantité distribuée (L)</Label>
                    <Input 
                      id="quantiteDistribuee"
                      name="quantiteDistribuee"
                      type="number"
                      min="0"
                      placeholder="Ex: 3800"
                      value={formData.quantiteDistribuee}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typeProduit">Type de produit</Label>
                    <Select 
                      value={formData.typeProduit} 
                      onValueChange={handleSelectChange("typeProduit")}
                    >
                      <SelectTrigger id="typeProduit">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eau_plate">Eau plate</SelectItem>
                        <SelectItem value="eau_gazeuse">Eau gazeuse</SelectItem>
                        <SelectItem value="eau_aromatisee">Eau aromatisée</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipementUtilise">Équipement utilisé</Label>
                    <Select 
                      value={formData.equipementUtilise} 
                      onValueChange={handleSelectChange("equipementUtilise")}
                    >
                      <SelectTrigger id="equipementUtilise">
                        <SelectValue placeholder="Sélectionner un équipement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="machine1">Machine principale</SelectItem>
                        <SelectItem value="machine2">Machine secondaire</SelectItem>
                        <SelectItem value="filtration1">Système de filtration 1</SelectItem>
                        <SelectItem value="filtration2">Système de filtration 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualite">Qualité de l'eau produite</Label>
                    <Select 
                      value={formData.qualite} 
                      onValueChange={handleSelectChange("qualite")}
                    >
                      <SelectTrigger id="qualite">
                        <SelectValue placeholder="Sélectionner la qualité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellente">Excellente</SelectItem>
                        <SelectItem value="bonne">Bonne</SelectItem>
                        <SelectItem value="moyenne">Moyenne</SelectItem>
                        <SelectItem value="insuffisante">Insuffisante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="commentaires">Commentaires</Label>
                    <Textarea 
                      id="commentaires"
                      name="commentaires"
                      placeholder="Observations, problèmes rencontrés, etc."
                      value={formData.commentaires}
                      onChange={handleChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setFormData({
                  date: "",
                  quantiteInitiale: "",
                  quantiteProduite: "",
                  quantiteDistribuee: "",
                  typeProduit: "eau_plate",
                  operateur: "",
                  equipementUtilise: "machine1",
                  qualite: "excellente",
                  commentaires: ""
                });
              }}>Réinitialiser</Button>
              <Button type="submit" form="waterProductionForm">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les données
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production journalière</CardTitle>
              <CardDescription>Vue d'ensemble de la production des 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="produit" name="Production (L)" fill="#0ea5e9" />
                  <Bar dataKey="distribue" name="Distribution (L)" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Exportation du graphique",
                  description: "Le graphique de production a été exporté.",
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="commandes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-500" />
                  <CardTitle>Commandes d'eau</CardTitle>
                </div>
                <Badge variant="outline" className="ml-2">
                  {commandes.length} commandes
                </Badge>
              </div>
              <CardDescription>
                Gestion des commandes et de la distribution d'eau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Date prévue</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commandes.map((commande) => (
                    <TableRow key={commande.id}>
                      <TableCell className="font-medium">{commande.id}</TableCell>
                      <TableCell>{commande.client}</TableCell>
                      <TableCell>{commande.produit}</TableCell>
                      <TableCell>{commande.quantite}</TableCell>
                      <TableCell>{commande.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          commande.statut === "livrée" ? "bg-green-100 text-green-800" : 
                          commande.statut === "en cours" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {commande.statut.charAt(0).toUpperCase() + commande.statut.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "Commande confirmée",
                            description: `La commande pour ${commande.client} a été confirmée.`
                          });
                        }}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirmer
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "QR code généré",
                            description: "Le QR code de la commande a été généré."
                          });
                        }}>
                          <QrCode className="h-4 w-4 mr-1" />
                          QR Code
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => {
                toast({
                  title: "Nouvelle commande",
                  description: "Le formulaire de nouvelle commande s'ouvrira prochainement."
                });
              }}>
                Nouvelle commande
              </Button>
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Export des données",
                  description: "La liste des commandes a été exportée."
                });
              }}>
                Exporter la liste
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de production</CardTitle>
              <CardDescription>
                Analyse détaillée de la production et distribution d'eau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Production totale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">128,500 L</div>
                        <div className="text-xs text-muted-foreground mt-1">Ce mois-ci</div>
                      </div>
                      <div className="p-2 rounded-full bg-sky-100 text-sky-600">
                        <Droplet className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Stock disponible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">12,400 L</div>
                        <div className="text-xs text-muted-foreground mt-1">Capacité max: 15,000 L</div>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <AreaChart className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Rendement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">98.7%</div>
                        <div className="text-xs text-muted-foreground mt-1">+1.2% par rapport au mois dernier</div>
                      </div>
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <BarChart4 className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Production mensuelle vs Objectifs</h3>
                <div className="h-72 border rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="produit" name="Production (L)" stroke="#0ea5e9" strokeWidth={2} />
                      <Line type="monotone" dataKey="objectif" name="Objectif (L)" stroke="#f43f5e" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Répartition par type de produit</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Eau plate (70%)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Eau gazeuse (20%)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Eau aromatisée (10%)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Répartition par client</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Hôtel (45%)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Restaurant (30%)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Conférences (15%)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm font-medium">Événements (10%)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Rapport généré",
                  description: "Le rapport complet des statistiques de production a été généré."
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Exporter le rapport complet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Water;
