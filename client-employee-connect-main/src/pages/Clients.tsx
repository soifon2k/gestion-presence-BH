import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pencil, 
  Trash2, 
  QrCode, 
  Filter, 
  Download, 
  Upload, 
  UserPlus
} from "lucide-react";
import ClientModal, { ClientData } from '@/components/ClientModal';
import CodeDisplay from '@/components/CodeDisplay';
import { toast } from "@/hooks/use-toast";

const clientsData: ClientData[] = [
  { id: 1, name: "Patrick Durand", service: "Hôtel", details: "Chambre 205", email: "patrick@exemple.com", phone: "+33 6 12 34 56 78", qrCode: "CL001", dateArrivee: "15/06/2023", dateDepart: "20/06/2023", status: "Actif" },
  { id: 2, name: "Carole Petit", service: "Restaurant", details: "Table 12", email: "carole@exemple.com", phone: "+33 6 23 45 67 89", qrCode: "CL002", dateArrivee: "18/06/2023", dateDepart: "18/06/2023", status: "Actif" },
  { id: 3, name: "François Leroy", service: "Salle de conférence", details: "Salle A", email: "francois@exemple.com", phone: "+33 6 34 56 78 90", qrCode: "CL003", dateArrivee: "20/06/2023", dateDepart: "20/06/2023", status: "Réservé" },
  { id: 4, name: "Nadia Kaddour", service: "Salle de fête", details: "Mariage", email: "nadia@exemple.com", phone: "+33 6 45 67 89 01", qrCode: "CL004", dateArrivee: "22/06/2023", dateDepart: "23/06/2023", status: "Réservé" },
  { id: 5, name: "Robert Johnson", service: "Production d'eau", details: "200L", email: "robert@exemple.com", phone: "+33 6 56 78 90 12", qrCode: "CL005", dateArrivee: "16/06/2023", dateDepart: "16/06/2023", status: "Terminé" },
  { id: 6, name: "Julie Moreau", service: "Hôtel", details: "Chambre 310", email: "julie@exemple.com", phone: "+33 6 67 89 01 23", qrCode: "CL006", dateArrivee: "17/06/2023", dateDepart: "24/06/2023", status: "Actif" },
  { id: 7, name: "Thomas Girard", service: "Restaurant", details: "Table 5", email: "thomas@exemple.com", phone: "+33 6 78 90 12 34", qrCode: "CL007", dateArrivee: "19/06/2023", dateDepart: "19/06/2023", status: "Réservé" },
  { id: 8, name: "Yasmine Bouzidi", service: "Salle de conférence", details: "Salle B", email: "yasmine@exemple.com", phone: "+33 6 89 01 23 45", qrCode: "CL008", dateArrivee: "21/06/2023", dateDepart: "21/06/2023", status: "Réservé" },
];

const getServiceColor = (service: string) => {
  const colors = {
    "Restaurant": "bg-orange-100 text-orange-800",
    "Hôtel": "bg-purple-100 text-purple-800",
    "Production d'eau": "bg-sky-100 text-sky-800",
    "Salle de conférence": "bg-pink-100 text-pink-800",
    "Salle de fête": "bg-green-100 text-green-800"
  };
  
  return colors[service as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getStatusColor = (status: string) => {
  const colors = {
    "Actif": "bg-green-100 text-green-800",
    "Réservé": "bg-blue-100 text-blue-800",
    "Terminé": "bg-gray-100 text-gray-800",
    "Annulé": "bg-red-100 text-red-800"
  };
  
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const Clients = () => {
  const [clients, setClients] = useState<ClientData[]>(clientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData | undefined>(undefined);
  const [isCodeDisplayOpen, setIsCodeDisplayOpen] = useState(false);
  const [selectedQrInfo, setSelectedQrInfo] = useState<{code: string, name: string, service: string}>({
    code: '', name: '', service: ''
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: ClientData) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleShowQrCode = (client: ClientData) => {
    setSelectedQrInfo({
      code: client.qrCode,
      name: client.name,
      service: client.service
    });
    setIsCodeDisplayOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès.",
    });
  };

  const handleSaveClient = async (clientData: ClientData): Promise<void> => {
    if (currentClient) {
      setClients(clients.map(client => 
        client.id === currentClient.id ? { ...client, ...clientData } : client
      ));
    } else {
      const newClient: ClientData = {
        ...clientData,
        id: clients.length + 1,
      };
      setClients([...clients, newClient]);
    }
    
    await new Promise<void>(resolve => setTimeout(resolve, 500));
  };

  return (
    <MainLayout title="Gestion des Clients">
      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="cards">Cartes</TabsTrigger>
            <TabsTrigger value="presence">Présence</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button size="sm" className="bg-company-blue hover:bg-company-darkBlue" onClick={handleAddClient}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Input 
            placeholder="Rechercher un client..." 
            className="max-w-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code QR</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.qrCode}</TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getServiceColor(client.service)}`}>
                          {client.service}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.details}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(client.status)}`}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShowQrCode(client)}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClient(client)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{client.name}</CardTitle>
                      <Badge variant="outline" className={`${getServiceColor(client.service)} mt-1`}>
                        {client.service}
                      </Badge>
                    </div>
                    <Badge className={`${getStatusColor(client.status)}`}>
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Détails:</span>
                      <span className="font-medium">{client.details}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Code QR:</span>
                      <span className="font-mono font-medium">{client.qrCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{client.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Téléphone:</span>
                      <span className="font-medium">{client.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Période:</span>
                      <span className="font-medium">{client.dateArrivee} - {client.dateDepart}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleShowQrCode(client)}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Code QR
                    </Button>
                    <div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClient(client)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteClient(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="presence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Présence des Clients - Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code QR</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Heure d'arrivée</TableHead>
                    <TableHead>Heure de départ</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.filter(c => c.status === "Actif").map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.qrCode}</TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getServiceColor(client.service)}`}>
                          {client.service}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.details}</TableCell>
                      <TableCell>{"10:" + Math.floor(Math.random() * 60).toString().padStart(2, '0')}</TableCell>
                      <TableCell>{client.service === "Restaurant" ? "12:" + Math.floor(Math.random() * 60).toString().padStart(2, '0') : ""}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(client.status)}`}>
                          {client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={currentClient}
        onSave={handleSaveClient}
      />

      <CodeDisplay
        isOpen={isCodeDisplayOpen}
        onClose={() => setIsCodeDisplayOpen(false)}
        codeType="qr"
        code={selectedQrInfo.code}
        name={selectedQrInfo.name}
        detail={selectedQrInfo.service}
      />
    </MainLayout>
  );
};

export default Clients;
