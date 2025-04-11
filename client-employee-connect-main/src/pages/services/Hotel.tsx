
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, PieChart } from "lucide-react";
import HotelRegistrationForm from '@/components/services/HotelRegistrationForm';

// Données simulées pour les clients de l'hôtel
const hotelClients = [
  { 
    id: 1, 
    code: "CL001", 
    nom: "Durand", 
    prenom: "Patrick", 
    postnom: "Jean",
    telephone: "+243 999 123 456",
    typeChambre: "Suite Junior",
    numeroChambre: "A101",
    dateArrivee: new Date("2023-06-15"),
    dateDepart: new Date("2023-06-20"),
    typePayement: "Carte de crédit",
    montant: "250"
  },
  { 
    id: 2, 
    code: "CL003", 
    nom: "Moreau", 
    prenom: "Julie", 
    postnom: "Marie",
    telephone: "+243 999 987 654",
    typeChambre: "Chambre Double",
    numeroChambre: "B205",
    dateArrivee: new Date("2023-06-17"),
    dateDepart: new Date("2023-06-22"),
    typePayement: "Espèces",
    montant: "180"
  },
  { 
    id: 3, 
    code: "CL006", 
    nom: "Girard", 
    prenom: "Thomas", 
    postnom: "",
    telephone: "+243 999 456 789",
    typeChambre: "Suite Exécutive",
    numeroChambre: "A305",
    dateArrivee: new Date("2023-06-18"),
    dateDepart: new Date("2023-06-25"),
    typePayement: "Virement bancaire",
    montant: "450"
  }
];

const Hotel = () => {
  const [clients, setClients] = useState(hotelClients);
  
  const handleRegistration = (data: any) => {
    const newClient = {
      id: clients.length + 1,
      ...data
    };
    
    setClients([...clients, newClient]);
  };

  return (
    <MainLayout title="Service Hôtel">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="overview" className="bg-white">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="registration" className="bg-white">Enregistrement</TabsTrigger>
          <TabsTrigger value="clients" className="bg-white">Clients</TabsTrigger>
          <TabsTrigger value="statistics" className="bg-white">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'occupation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  42 chambres sur 50 occupées
                </p>
                <div className="h-2 rounded-full bg-gray-100 mt-3">
                  <div className="h-2 rounded-full bg-blue-500 w-[85%]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clients enregistrés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8 depuis hier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenu journalier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,250</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +15% par rapport à la semaine dernière
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Derniers enregistrements</CardTitle>
                <CardDescription>Clients récemment enregistrés à l'hôtel</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Chambre</TableHead>
                      <TableHead>Arrivée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.slice(0, 5).map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.code}</TableCell>
                        <TableCell className="font-medium">{client.nom} {client.prenom}</TableCell>
                        <TableCell>{client.numeroChambre}</TableCell>
                        <TableCell>{client.dateArrivee.toLocaleDateString('fr-FR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Disponibilité des chambres</CardTitle>
                <CardDescription>Statut actuel des chambres par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Chambre Simple", total: 20, occupees: 15, libres: 5 },
                    { type: "Chambre Double", total: 15, occupees: 13, libres: 2 },
                    { type: "Suite Junior", total: 8, occupees: 7, libres: 1 },
                    { type: "Suite Exécutive", total: 5, occupees: 5, libres: 0 },
                    { type: "Appartement", total: 2, occupees: 2, libres: 0 }
                  ].map((room, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{room.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {room.occupees} / {room.total} occupées
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={room.libres > 0 ? "outline" : "destructive"} className={room.libres > 0 ? "bg-green-50 text-green-700" : ""}>
                          {room.libres > 0 ? `${room.libres} disponibles` : "Complet"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="registration">
          <HotelRegistrationForm onSubmit={handleRegistration} />
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Liste des clients</CardTitle>
              <CardDescription>
                Tous les clients actuellement enregistrés à l'hôtel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Chambre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Arrivée</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-mono text-xs">{client.code}</TableCell>
                      <TableCell className="font-medium">
                        {client.nom} {client.postnom} {client.prenom}
                      </TableCell>
                      <TableCell>{client.telephone}</TableCell>
                      <TableCell>{client.numeroChambre}</TableCell>
                      <TableCell>{client.typeChambre}</TableCell>
                      <TableCell>{client.dateArrivee.toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{client.dateDepart.toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>${client.montant}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de l'hôtel</CardTitle>
              <CardDescription>
                Analyses et tendances du service hôtel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4">Occupation par période</h3>
                  <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Revenus mensuels</h3>
                  <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="font-medium">Rapports disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Rapport d'occupation", format: "PDF" },
                    { title: "Rapport financier", format: "Excel" },
                    { title: "Liste des clients", format: "PDF" },
                    { title: "Statistiques de séjour", format: "Excel" }
                  ].map((report, i) => (
                    <Button key={i} variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">{report.title}</span>
                      <Badge variant="secondary">{report.format}</Badge>
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Hotel;
