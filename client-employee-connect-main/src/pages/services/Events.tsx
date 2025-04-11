
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, Save, Users, MapPin, Clock, Check, QrCode, PieChart, BarChart4 } from "lucide-react";

const Events = () => {
  const [formData, setFormData] = useState({
    nomEvenement: "",
    typeEvenement: "social",
    organisateur: "",
    telephone: "",
    email: "",
    nombreParticipants: "50",
    dateDebut: "",
    dateFin: "",
    heureDebut: "",
    heureFin: "",
    lieu: "Grande salle",
    services: {
      restauration: true,
      audioVisuel: true,
      decoration: false,
      securite: false,
      hebergement: false,
    },
    budget: "",
    commentaires: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [name]: checked
      }
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
      title: "Événement enregistré",
      description: `L'événement "${formData.nomEvenement}" a été enregistré avec succès.`,
    });
  };

  // Données d'événements simulées
  const events = [
    { id: 1, nom: "Gala annuel", type: "social", organisateur: "Association ABC", date: "2025-05-20", lieu: "Grande salle", participants: 150, statut: "confirmé" },
    { id: 2, nom: "Lancement de produit", type: "corporate", organisateur: "Tech Solutions", date: "2025-06-15", lieu: "Espace Extérieur", participants: 80, statut: "en attente" },
    { id: 3, nom: "Mariage Martin", type: "mariage", organisateur: "Famille Martin", date: "2025-07-10", lieu: "Grande salle + Jardin", participants: 120, statut: "confirmé" },
    { id: 4, nom: "Séminaire d'entreprise", type: "corporate", organisateur: "Groupe XYZ", date: "2025-08-05", lieu: "Salles de conférence", participants: 60, statut: "confirmé" },
  ];

  return (
    <MainLayout title="Événements">
      <Tabs defaultValue="nouvel-evenement" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="nouvel-evenement" className="bg-white">Nouvel événement</TabsTrigger>
          <TabsTrigger value="liste" className="bg-white">Liste des événements</TabsTrigger>
          <TabsTrigger value="stats" className="bg-white">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="nouvel-evenement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <CardTitle>Nouvel événement</CardTitle>
              </div>
              <CardDescription>
                Enregistrez un nouvel événement social, corporate ou autre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="eventForm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomEvenement">Nom de l'événement</Label>
                    <Input 
                      id="nomEvenement"
                      name="nomEvenement"
                      placeholder="Gala annuel"
                      value={formData.nomEvenement}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typeEvenement">Type d'événement</Label>
                    <Select 
                      value={formData.typeEvenement} 
                      onValueChange={handleSelectChange("typeEvenement")}
                    >
                      <SelectTrigger id="typeEvenement">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Événement social</SelectItem>
                        <SelectItem value="corporate">Événement corporate</SelectItem>
                        <SelectItem value="mariage">Mariage</SelectItem>
                        <SelectItem value="conference">Conférence</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisateur">Organisateur</Label>
                    <Input 
                      id="organisateur"
                      name="organisateur"
                      placeholder="Société / Personne"
                      value={formData.organisateur}
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreParticipants">Nombre de participants</Label>
                    <Input 
                      id="nombreParticipants"
                      name="nombreParticipants"
                      type="number"
                      min="1"
                      max="500"
                      value={formData.nombreParticipants}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lieu">Lieu</Label>
                    <Select 
                      value={formData.lieu} 
                      onValueChange={handleSelectChange("lieu")}
                    >
                      <SelectTrigger id="lieu">
                        <SelectValue placeholder="Sélectionner un lieu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grande salle">Grande salle (max 200 pers.)</SelectItem>
                        <SelectItem value="Espace Extérieur">Espace Extérieur (max 300 pers.)</SelectItem>
                        <SelectItem value="Salles de conférence">Salles de conférence (max 100 pers.)</SelectItem>
                        <SelectItem value="Jardin">Jardin (max 150 pers.)</SelectItem>
                        <SelectItem value="Grande salle + Jardin">Grande salle + Jardin (max 350 pers.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début</Label>
                    <Input 
                      id="dateDebut"
                      name="dateDebut"
                      type="date"
                      value={formData.dateDebut}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Date de fin</Label>
                    <Input 
                      id="dateFin"
                      name="dateFin"
                      type="date"
                      value={formData.dateFin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureDebut">Heure de début</Label>
                    <Input 
                      id="heureDebut"
                      name="heureDebut"
                      type="time"
                      value={formData.heureDebut}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureFin">Heure de fin</Label>
                    <Input 
                      id="heureFin"
                      name="heureFin"
                      type="time"
                      value={formData.heureFin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget estimé</Label>
                    <Input 
                      id="budget"
                      name="budget"
                      type="number"
                      min="0"
                      placeholder="Budget en monnaie locale"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-4 md:col-span-2">
                    <Label>Services requis</Label>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="restauration" 
                          checked={formData.services.restauration} 
                          onCheckedChange={handleSwitchChange("restauration")}
                        />
                        <Label htmlFor="restauration">Restauration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="audioVisuel" 
                          checked={formData.services.audioVisuel} 
                          onCheckedChange={handleSwitchChange("audioVisuel")}
                        />
                        <Label htmlFor="audioVisuel">Audio-visuel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="decoration" 
                          checked={formData.services.decoration} 
                          onCheckedChange={handleSwitchChange("decoration")}
                        />
                        <Label htmlFor="decoration">Décoration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="securite" 
                          checked={formData.services.securite} 
                          onCheckedChange={handleSwitchChange("securite")}
                        />
                        <Label htmlFor="securite">Sécurité</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="hebergement" 
                          checked={formData.services.hebergement} 
                          onCheckedChange={handleSwitchChange("hebergement")}
                        />
                        <Label htmlFor="hebergement">Hébergement</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="commentaires">Commentaires ou besoins particuliers</Label>
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
                  ...formData,
                  nomEvenement: "",
                  organisateur: "",
                  telephone: "",
                  email: "",
                  nombreParticipants: "50",
                  dateDebut: "",
                  dateFin: "",
                  heureDebut: "",
                  heureFin: "",
                  budget: "",
                  commentaires: ""
                });
              }}>Réinitialiser</Button>
              <Button type="submit" form="eventForm">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer l'événement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <CardTitle>Liste des événements</CardTitle>
                </div>
                <Badge variant="outline" className="ml-2">
                  {events.length} événements prévus
                </Badge>
              </div>
              <CardDescription>
                Tous les événements planifiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Organisateur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.id}</TableCell>
                      <TableCell>{event.nom}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          event.type === 'social' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'corporate' ? 'bg-purple-100 text-purple-800' :
                          event.type === 'mariage' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100'
                        }>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.organisateur}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.lieu}</TableCell>
                      <TableCell>{event.participants}</TableCell>
                      <TableCell>
                        <Badge variant={event.statut === "confirmé" ? "default" : "outline"} className={
                          event.statut === "confirmé" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }>
                          {event.statut.charAt(0).toUpperCase() + event.statut.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "Événement confirmé",
                            description: `L'événement "${event.nom}" a été confirmé.`
                          });
                        }}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirmer
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "QR code généré",
                            description: "Le QR code d'accès a été généré et envoyé à l'organisateur."
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
                  description: "La liste des événements a été exportée."
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
              <CardTitle>Statistiques des événements</CardTitle>
              <CardDescription>
                Analyse des événements et performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Événements à venir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-muted-foreground mt-1">Prochain: Gala annuel (20/05)</div>
                      </div>
                      <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Revenus prévus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">65,000 €</div>
                        <div className="text-xs text-muted-foreground mt-1">+15% par rapport à 2024</div>
                      </div>
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <PieChart className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Participants attendus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">1,250</div>
                        <div className="text-xs text-muted-foreground mt-1">Sur tous les événements à venir</div>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <PieChart className="h-4 w-4 mr-2 text-indigo-500" />
                    Répartition par type d'événement
                  </h3>
                  <div className="h-60 flex items-center justify-center">
                    {/* Représentation simple d'un graphique camembert */}
                    <div className="relative h-40 w-40 rounded-full overflow-hidden">
                      <div className="absolute h-full w-full" style={{
                        background: "conic-gradient(#818cf8 0% 35%, #c084fc 35% 55%, #ec4899 55% 80%, #60a5fa 80% 100%)"
                      }}></div>
                      <div className="absolute inset-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-indigo-400 mr-2"></div>
                        <span>Corporate (35%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-purple-400 mr-2"></div>
                        <span>Social (20%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-pink-400 mr-2"></div>
                        <span>Mariages (25%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-400 mr-2"></div>
                        <span>Autres (20%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                    Utilisation des espaces
                  </h3>
                  <div className="h-60 flex items-end justify-around">
                    {["Grande salle", "Extérieur", "Conférences", "Jardin", "Combiné"].map((space, i) => {
                      const height = [80, 65, 40, 55, 90][i];
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-indigo-500 rounded-t-md" 
                            style={{height: `${height}%`}}
                          ></div>
                          <span className="text-sm mt-2 text-center">{space}</span>
                          <span className="text-xs text-muted-foreground">{height}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Events;
