
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
import { Utensils, Save, Users, Calendar, Clock, Check, QrCode } from "lucide-react";

const Restaurant = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    nombrePersonnes: "2",
    dateReservation: "",
    heureReservation: "",
    tableDemandee: "",
    typeCuisine: "standard",
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
      title: "Réservation enregistrée",
      description: `Réservation pour ${formData.nom} ${formData.prenom} confirmée.`,
    });
  };

  // Données de réservations simulées
  const reservations = [
    { id: 1, nom: "Dupont", prenom: "Jean", date: "2025-04-08", heure: "19:00", personnes: 4, table: "A12" },
    { id: 2, nom: "Martin", prenom: "Sophie", date: "2025-04-08", heure: "20:30", personnes: 2, table: "B03" },
    { id: 3, nom: "Bernard", prenom: "Michel", date: "2025-04-09", heure: "12:00", personnes: 6, table: "C02" },
    { id: 4, nom: "Petit", prenom: "Carole", date: "2025-04-09", heure: "13:30", personnes: 3, table: "A05" },
    { id: 5, nom: "Lambert", prenom: "Pierre", date: "2025-04-10", heure: "19:45", personnes: 2, table: "B10" }
  ];

  return (
    <MainLayout title="Restaurant">
      <Tabs defaultValue="reservation" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="reservation" className="bg-white">Réservation</TabsTrigger>
          <TabsTrigger value="liste" className="bg-white">Liste des réservations</TabsTrigger>
          <TabsTrigger value="stats" className="bg-white">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="reservation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <CardTitle>Nouvelle réservation restaurant</CardTitle>
              </div>
              <CardDescription>
                Enregistrer une nouvelle réservation pour le restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="restaurantForm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input 
                      id="nom"
                      name="nom"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input 
                      id="prenom"
                      name="prenom"
                      placeholder="Jean"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input 
                      id="telephone"
                      name="telephone"
                      type="tel"
                      placeholder="+123456789"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombrePersonnes">Nombre de personnes</Label>
                    <Select 
                      value={formData.nombrePersonnes} 
                      onValueChange={handleSelectChange("nombrePersonnes")}
                    >
                      <SelectTrigger id="nombrePersonnes">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'personne' : 'personnes'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateReservation">Date de réservation</Label>
                    <Input 
                      id="dateReservation"
                      name="dateReservation"
                      type="date"
                      value={formData.dateReservation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureReservation">Heure de réservation</Label>
                    <Input 
                      id="heureReservation"
                      name="heureReservation"
                      type="time"
                      value={formData.heureReservation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tableDemandee">Table demandée (optionnel)</Label>
                    <Input 
                      id="tableDemandee"
                      name="tableDemandee"
                      placeholder="Exemple: Table en terrasse"
                      value={formData.tableDemandee}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="typeCuisine">Type de cuisine</Label>
                    <Select 
                      value={formData.typeCuisine} 
                      onValueChange={handleSelectChange("typeCuisine")}
                    >
                      <SelectTrigger id="typeCuisine">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="vegetarien">Végétarien</SelectItem>
                        <SelectItem value="halal">Halal</SelectItem>
                        <SelectItem value="casher">Casher</SelectItem>
                        <SelectItem value="sansgluten">Sans gluten</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="commentaires">Commentaires ou demandes spéciales</Label>
                    <Textarea 
                      id="commentaires"
                      name="commentaires"
                      placeholder="Indiquez toute information ou demande particulière ici..."
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
                  nom: "",
                  prenom: "",
                  telephone: "",
                  email: "",
                  nombrePersonnes: "2",
                  dateReservation: "",
                  heureReservation: "",
                  tableDemandee: "",
                  typeCuisine: "standard",
                  commentaires: ""
                });
              }}>Réinitialiser</Button>
              <Button type="submit" form="restaurantForm">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer la réservation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <CardTitle>Liste des réservations</CardTitle>
                </div>
                <Badge variant="outline" className="ml-2">
                  {reservations.length} réservations
                </Badge>
              </div>
              <CardDescription>
                Toutes les réservations du restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Personnes</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.nom}</TableCell>
                      <TableCell>{reservation.prenom}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.heure}</TableCell>
                      <TableCell>{reservation.personnes}</TableCell>
                      <TableCell>{reservation.table}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "Réservation confirmée",
                            description: `La réservation pour ${reservation.nom} ${reservation.prenom} a été confirmée.`
                          });
                        }}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirmer
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "QR code généré",
                            description: "Le QR code a été généré et envoyé au client."
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
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Export des données",
                  description: "La liste des réservations a été exportée."
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
              <CardTitle>Statistiques du restaurant</CardTitle>
              <CardDescription>
                Performance et indicateurs du service de restauration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Réservations aujourd'hui</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">18</div>
                        <div className="text-xs text-muted-foreground mt-1">+3 depuis hier</div>
                      </div>
                      <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tables disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">8/25</div>
                        <div className="text-xs text-muted-foreground mt-1">32% de disponibilité</div>
                      </div>
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <Utensils className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Heure de pointe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">19h30</div>
                        <div className="text-xs text-muted-foreground mt-1">15 réservations à cette heure</div>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 border rounded-lg p-4">
                <h3 className="font-medium mb-3">Distribution des réservations par jour</h3>
                <div className="h-60 flex items-end justify-around">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => {
                    const height = [50, 65, 45, 70, 85, 95, 80][i];
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-orange-500 rounded-t-md" 
                          style={{height: `${height}%`}}
                        ></div>
                        <span className="text-sm mt-2">{day}</span>
                        <span className="text-xs text-muted-foreground">{Math.round(height * 0.3)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Restaurant;
