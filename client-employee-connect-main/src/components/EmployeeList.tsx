
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus, Barcode } from "lucide-react";

const employeesData = [
  { id: 1, name: "Jean Dupont", department: "Administration", position: "Directeur", email: "jean@exemple.com", badgeNumber: "EMP001" },
  { id: 2, name: "Marie Martin", department: "Restaurant", position: "Cheffe", email: "marie@exemple.com", badgeNumber: "EMP002" },
  { id: 3, name: "Pierre Thomas", department: "Hôtel", position: "Réceptionniste", email: "pierre@exemple.com", badgeNumber: "EMP003" },
  { id: 4, name: "Sophie Laurent", department: "Production d'eau", position: "Technicienne", email: "sophie@exemple.com", badgeNumber: "EMP004" },
  { id: 5, name: "Ahmed Bensaid", department: "Salle de conférence", position: "Responsable", email: "ahmed@exemple.com", badgeNumber: "EMP005" },
];

const getDepartmentColor = (department: string) => {
  const colors = {
    "Administration": "bg-blue-100 text-blue-800",
    "Restaurant": "bg-orange-100 text-orange-800",
    "Hôtel": "bg-purple-100 text-purple-800",
    "Production d'eau": "bg-sky-100 text-sky-800",
    "Salle de conférence": "bg-pink-100 text-pink-800",
    "Salle de fête": "bg-green-100 text-green-800"
  };
  
  return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const EmployeeList = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Liste des Employés</CardTitle>
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
              <TableHead>Département</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Num. Badge</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </Badge>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.badgeNumber}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" className="mr-2">
                    <Barcode className="h-4 w-4" />
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

export default EmployeeList;
