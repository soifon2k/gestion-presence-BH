
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Presentation, Save, Users, Calendar, Clock, Check, QrCode, PieChart, BarChart4 } from "lucide-react";

const Conferences = () => {
  const [formData, setFormData] = useState({
    nomEvenement: "",
    organisateur: "",
    telephone: "",
    email: "",
    nombreParticipants: "20",
    dateDebut: "",
    dateFin: "",
    heureDebut: "",
    heureFin: "",
    salle: "Grande salle",
    equipements: {
      projecteur: true,
      sono: false,
      visio: false,
      internet: true,
      tableau: false,
    },
    commentaires: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData({
      ...formData,
      equipements: {
        ...formData.equipements,
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
      title: "Réservation enregistrée",
      description: `Conférence "${formData.nomEvenement}" confirmée.`,
    });
  };

  // Données de conférences simulées
  const conferences = [
    { id: 1, nom: "Conférence annuelle", organisateur: "Société ABC", date: "2025-04-15", heureDebut: "09:00", heureFin: "17:00", salle: "Grande salle", participants: 50 },
    { id: 2, nom: "Formation produit", organisateur: "Tech Solutions", date: "2025-04-20", heureDebut: "10:30", heureFin: "15:30", salle: "Salle B", participants: 25 },
    { id: 3, nom: "Réunion Conseil", organisateur: "Association XYZ", date: "2025-05-02", heureDebut: "14:00", heureFin: "16:00", salle: "Salle C", participants: 12 },
    { id: 4, nom: "Workshop Innovation", organisateur: "StartupLab", date: "2025-05-10", heureDebut: "09:30", heureFin: "18:00", salle: "Grande salle", participants: 40 },
  ];

  return (
    <MainLayout title="Conférences">
      <Tabs defaultValue="reservation" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="reservation" className="bg-white">Réservation</TabsTrigger>
          <TabsTrigger value="liste" className="bg-white">Planning des conférences</TabsTrigger>
          <TabsTrigger value="stats" className="bg-white">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="reservation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-pink-500" />
                <CardTitle>Nouvelle réservation de conférence</CardTitle>
              </div>
              <CardDescription>
                Réservez une salle pour conférence, réunion ou événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="conferenceForm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomEvenement">Nom de l'événement</Label>
                    <Input 
                      id="nomEvenement"
                      name="nomEvenement"
                      placeholder="Conférence annuelle"
                      value={formData.nomEvenement}
                      onChange={handleChange}
                      required
                    />
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
                      max="100"
                      value={formData.nombreParticipants}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salle">Salle</Label>
                    <Select 
                      value={formData.salle} 
                      onValueChange={handleSelectChange("salle")}
                    >
                      <SelectTrigger id="salle">
                        <SelectValue placeholder="Sélectionner une salle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grande salle">Grande salle (max 100 pers.)</SelectItem>
                        <SelectItem value="Salle B">Salle B (max 50 pers.)</SelectItem>
                        <SelectItem value="Salle C">Salle C (max 30 pers.)</SelectItem>
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
                  
                  <div className="space-y-4 md:col-span-2">
                    <Label>Équipements requis</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="projecteur" 
                          checked={formData.equipements.projecteur} 
                          onCheckedChange={handleCheckboxChange("projecteur")}
                        />
                        <Label htmlFor="projecteur">Projecteur</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sono" 
                          checked={formData.equipements.sono} 
                          onCheckedChange={handleCheckboxChange("sono")}
                        />
                        <Label htmlFor="sono">Sonorisation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="visio" 
                          checked={formData.equipements.visio} 
                          onCheckedChange={handleCheckboxChange("visio")}
                        />
                        <Label htmlFor="visio">Visioconférence</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="internet" 
                          checked={formData.equipements.internet} 
                          onCheckedChange={handleCheckboxChange("internet")}
                        />
                        <Label htmlFor="internet">Wifi/Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tableau" 
                          checked={formData.equipements.tableau} 
                          onCheckedChange={handleCheckboxChange("tableau")}
                        />
                        <Label htmlFor="tableau">Tableau blanc</Label>
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
                  nombreParticipants: "20",
                  dateDebut: "",
                  dateFin: "",
                  heureDebut: "",
                  heureFin: "",
                  commentaires: ""
                });
              }}>Réinitialiser</Button>
              <Button type="submit" form="conferenceForm">
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
                  <Calendar className="h-5 w-5 text-pink-500" />
                  <CardTitle>Planning des conférences</CardTitle>
                </div>
                <Badge variant="outline" className="ml-2">
                  {conferences.length} conférences prévues
                </Badge>
              </div>
              <CardDescription>
                Liste des événements et réservations de salles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead>Organisateur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conferences.map((conference) => (
                    <TableRow key={conference.id}>
                      <TableCell className="font-medium">{conference.id}</TableCell>
                      <TableCell>{conference.nom}</TableCell>
                      <TableCell>{conference.organisateur}</TableCell>
                      <TableCell>{conference.date}</TableCell>
                      <TableCell>{conference.heureDebut} - {conference.heureFin}</TableCell>
                      <TableCell>{conference.salle}</TableCell>
                      <TableCell>{conference.participants}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "Conférence confirmée",
                            description: `La conférence "${conference.nom}" a été confirmée.`
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
                  description: "Le planning des conférences a été exporté."
                });
              }}>
                Exporter le planning
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des conférences</CardTitle>
              <CardDescription>
                Données d'utilisation des salles de conférence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'occupation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">67%</div>
                        <div className="text-xs text-muted-foreground mt-1">+5% depuis le mois dernier</div>
                      </div>
                      <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                        <Presentation className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total des réservations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">42</div>
                        <div className="text-xs text-muted-foreground mt-1">Ce mois-ci</div>
                      </div>
                      <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Participants totaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">1,250</div>
                        <div className="text-xs text-muted-foreground mt-1">Ce trimestre</div>
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
                    <PieChart className="h-4 w-4 mr-2 text-pink-500" />
                    Répartition par type d'événement
                  </h3>
                  <div className="h-60 flex items-center justify-center">
                    {/* Représentation simple d'un graphique camembert */}
                    <div className="relative h-40 w-40 rounded-full overflow-hidden">
                      <div className="absolute h-full w-full" style={{
                        background: "conic-gradient(#e779c1 0% 40%, #818cf8 40% 65%, #60a5fa 65% 80%, #34d399 80% 100%)"
                      }}></div>
                      <div className="absolute inset-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-pink-400 mr-2"></div>
                        <span>Conférences (40%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-indigo-400 mr-2"></div>
                        <span>Formations (25%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-400 mr-2"></div>
                        <span>Réunions (15%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-400 mr-2"></div>
                        <span>Autres (20%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <BarChart4 className="h-4 w-4 mr-2 text-pink-500" />
                    Utilisation des salles par mois
                  </h3>
                  <div className="h-60 flex items-end justify-around">
                    {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"].map((month, i) => {
                      const heightG = [60, 75, 45, 85, 65, 70][i];
                      const heightB = [40, 35, 25, 55, 45, 50][i];
                      const heightC = [20, 30, 15, 35, 25, 30][i];
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className="flex flex-col items-center w-12">
                            <div className="w-full bg-pink-500 rounded-t-sm" style={{height: `${heightG * 0.5}px`}}></div>
                            <div className="w-full bg-indigo-400" style={{height: `${heightB * 0.5}px`}}></div>
                            <div className="w-full bg-blue-400" style={{height: `${heightC * 0.5}px`}}></div>
                          </div>
                          <span className="text-sm mt-2">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-around mt-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-pink-500 mr-1"></div>
                      <span className="text-xs">Grande salle</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-indigo-400 mr-1"></div>
                      <span className="text-xs">Salle B</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-blue-400 mr-1"></div>
                      <span className="text-xs">Salle C</span>
                    </div>
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

export default Conferences;
