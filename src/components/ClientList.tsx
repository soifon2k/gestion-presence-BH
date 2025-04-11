
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus, QrCode } from "lucide-react";

const clientsData = [
  { id: 1, name: "Patrick Durand", service: "Hôtel", roomNumber: "205", email: "patrick@exemple.com", qrCode: "CL001" },
  { id: 2, name: "Carole Petit", service: "Restaurant", table: "12", email: "carole@exemple.com", qrCode: "CL002" },
  { id: 3, name: "François Leroy", service: "Salle de conférence", room: "Salle A", email: "francois@exemple.com", qrCode: "CL003" },
  { id: 4, name: "Nadia Kaddour", service: "Salle de fête", event: "Mariage", email: "nadia@exemple.com", qrCode: "CL004" },
  { id: 5, name: "Robert Johnson", service: "Production d'eau", order: "200L", email: "robert@exemple.com", qrCode: "CL005" },
];

const getServiceColor = (service: string) => {
  const colors = {
    "Administration": "bg-blue-100 text-blue-800",
    "Restaurant": "bg-orange-100 text-orange-800",
    "Hôtel": "bg-purple-100 text-purple-800",
    "Production d'eau": "bg-sky-100 text-sky-800",
    "Salle de conférence": "bg-pink-100 text-pink-800",
    "Salle de fête": "bg-green-100 text-green-800"
  };
  
  return colors[service as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const ClientList = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Liste des Clients</CardTitle>
        <Button size="sm" className="bg-company-blue hover:bg-company-darkBlue">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Code QR</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsData.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getServiceColor(client.service)}`}>
                    {client.service}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.roomNumber && `Chambre ${client.roomNumber}`}
                  {client.table && `Table ${client.table}`}
                  {client.room && client.room}
                  {client.event && client.event}
                  {client.order && client.order}
                </TableCell>
                <TableCell>{client.qrCode}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" className="mr-2">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClientList;
