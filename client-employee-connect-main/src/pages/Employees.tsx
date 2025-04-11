
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Barcode, 
  Filter, 
  Download, 
  Upload, 
  UserPlus,
  Clock,
  FileText,
  X
} from "lucide-react";
import EmployeeModal, { EmployeeData } from '@/components/EmployeeModal';
import CodeDisplay from '@/components/CodeDisplay';
import { toast } from "@/hooks/use-toast";
import AbsenceForm, { AbsenceData } from '@/components/AbsenceForm';

const employeesData: EmployeeData[] = [
  { id: 1, name: "Jean Dupont", department: "Administration", position: "Directeur", email: "jean@exemple.com", phone: "+33 6 12 34 56 78", address: "12 Rue de Paris", badgeNumber: "EMP001", status: "Présent" },
  { id: 2, name: "Marie Martin", department: "Restaurant", position: "Cheffe", email: "marie@exemple.com", phone: "+33 6 23 45 67 89", address: "24 Avenue des Champs", badgeNumber: "EMP002", status: "Absent" },
  { id: 3, name: "Pierre Thomas", department: "Hôtel", position: "Réceptionniste", email: "pierre@exemple.com", phone: "+33 6 34 56 78 90", address: "36 Boulevard Central", badgeNumber: "EMP003", status: "Présent" },
  { id: 4, name: "Sophie Laurent", department: "Production d'eau", position: "Technicienne", email: "sophie@exemple.com", phone: "+33 6 45 67 89 01", address: "48 Allée des Roses", badgeNumber: "EMP004", status: "Congé" },
  { id: 5, name: "Ahmed Bensaid", department: "Salle de conférence", position: "Responsable", email: "ahmed@exemple.com", phone: "+33 6 56 78 90 12", address: "60 Impasse du Soleil", badgeNumber: "EMP005", status: "Présent" },
  { id: 6, name: "Lucie Dubois", department: "Salle de fête", position: "Coordinatrice", email: "lucie@exemple.com", phone: "+33 6 67 89 01 23", address: "72 Rue des Lilas", badgeNumber: "EMP006", status: "Présent" },
  { id: 7, name: "Marc Lefebvre", department: "Administration", position: "RH", email: "marc@exemple.com", phone: "+33 6 78 90 12 34", address: "84 Avenue de la République", badgeNumber: "EMP007", status: "Présent" },
  { id: 8, name: "Fatima Nasser", department: "Restaurant", position: "Serveuse", email: "fatima@exemple.com", phone: "+33 6 89 01 23 45", address: "96 Boulevard Voltaire", badgeNumber: "EMP008", status: "Absent" },
];

// Liste des absences
const absencesData: AbsenceData[] = [
  { 
    id: 1, 
    employeeId: 2, 
    employeeName: "Marie Martin", 
    type: "Maladie", 
    startDate: new Date("2023-06-15"), 
    endDate: new Date("2023-06-20"), 
    motif: "Grippe saisonnière", 
    justification: "Certificat médical #12345", 
    status: "Approuvé" 
  },
  { 
    id: 2, 
    employeeId: 8, 
    employeeName: "Fatima Nasser", 
    type: "Congé sans solde", 
    startDate: new Date("2023-06-18"), 
    endDate: new Date("2023-06-25"), 
    motif: "Voyage familial", 
    status: "Approuvé" 
  },
  { 
    id: 3, 
    employeeId: 4, 
    employeeName: "Sophie Laurent", 
    type: "Congé payé", 
    startDate: new Date("2023-06-10"), 
    endDate: new Date("2023-06-24"), 
    motif: "Vacances annuelles", 
    status: "Approuvé" 
  }
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

const getStatusColor = (status: string) => {
  const colors = {
    "Présent": "bg-green-100 text-green-800",
    "Absent": "bg-red-100 text-red-800",
    "Congé": "bg-amber-100 text-amber-800",
    "Mission": "bg-blue-100 text-blue-800"
  };
  
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getAbsenceTypeColor = (type: string) => {
  const colors = {
    "Maladie": "bg-red-100 text-red-800",
    "Congé payé": "bg-blue-100 text-blue-800",
    "Congé sans solde": "bg-amber-100 text-amber-800",
    "Formation": "bg-green-100 text-green-800",
    "Mission": "bg-purple-100 text-purple-800",
    "Raison personnelle": "bg-pink-100 text-pink-800"
  };
  
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getAbsenceStatusColor = (status: string) => {
  const colors = {
    "En attente": "bg-amber-100 text-amber-800",
    "Approuvé": "bg-green-100 text-green-800",
    "Rejeté": "bg-red-100 text-red-800"
  };
  
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>(employeesData);
  const [absences, setAbsences] = useState<AbsenceData[]>(absencesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isAbsenceListOpen, setIsAbsenceListOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeData | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | undefined>(undefined);
  const [isCodeDisplayOpen, setIsCodeDisplayOpen] = useState(false);
  const [selectedBadgeInfo, setSelectedBadgeInfo] = useState<{code: string, name: string, department: string}>({
    code: '', name: '', department: ''
  });

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setCurrentEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: EmployeeData) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleShowBarcode = (employee: EmployeeData) => {
    setSelectedBadgeInfo({
      code: employee.badgeNumber,
      name: employee.name,
      department: employee.department
    });
    setIsCodeDisplayOpen(true);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    // Supprimer également les absences associées à cet employé
    setAbsences(absences.filter(absence => absence.employeeId !== id));
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès.",
    });
  };

  const handleSaveEmployee = async (employeeData: EmployeeData): Promise<void> => {
    if (currentEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === currentEmployee.id ? { ...emp, ...employeeData } : emp
      ));
    } else {
      const newEmployee: EmployeeData = {
        ...employeeData,
        id: employees.length + 1,
      };
      setEmployees([...employees, newEmployee]);
    }
    
    await new Promise<void>(resolve => setTimeout(resolve, 500));
  };

  // Gestion des absences
  const handleAddAbsence = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setIsAbsenceModalOpen(true);
  };

  const handleShowAbsences = () => {
    setIsAbsenceListOpen(true);
  };

  const handleSaveAbsence = async (absenceData: AbsenceData): Promise<void> => {
    // Mise à jour ou ajout d'une absence
    const newAbsence: AbsenceData = {
      ...absenceData,
      id: absenceData.id || absences.length + 1
    };
    
    if (absenceData.id) {
      setAbsences(absences.map(abs => 
        abs.id === absenceData.id ? newAbsence : abs
      ));
    } else {
      setAbsences([...absences, newAbsence]);
    }
    
    // Mettre à jour le statut de l'employé si l'absence est approuvée et actuelle
    const today = new Date();
    if (
      absenceData.status === 'Approuvé' &&
      absenceData.startDate <= today &&
      absenceData.endDate >= today
    ) {
      const absenceType = absenceData.type === "Maladie" ? "Absent" : 
                          (absenceData.type === "Mission" ? "Mission" : "Congé");
      
      setEmployees(employees.map(emp => 
        emp.id === absenceData.employeeId ? { ...emp, status: absenceType } : emp
      ));
    }
    
    await new Promise<void>(resolve => setTimeout(resolve, 500));
  };

  const handleDeleteAbsence = (id: number) => {
    setAbsences(absences.filter(absence => absence.id !== id));
    toast({
      title: "Absence supprimée",
      description: "L'absence a été supprimée avec succès.",
    });
  };

  // Exportation des données
  const handleExportData = () => {
    // Dans une vraie implémentation, créez un CSV/Excel
    const employeeData = employees.map(emp => ({
      ID: emp.badgeNumber,
      Nom: emp.name,
      Département: emp.department,
      Poste: emp.position,
      Email: emp.email,
      Téléphone: emp.phone,
      Adresse: emp.address,
      Statut: emp.status
    }));
    
    const jsonString = JSON.stringify(employeeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportation réussie",
      description: "Les données ont été exportées avec succès.",
    });
  };

  return (
    <MainLayout title="Gestion des Employés">
      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="cards">Cartes</TabsTrigger>
            <TabsTrigger value="attendance">Présence</TabsTrigger>
            <TabsTrigger value="absences">Absences</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShowAbsences}>
              <Clock className="h-4 w-4 mr-2" />
              Absences
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button size="sm" className="bg-company-blue hover:bg-company-darkBlue" onClick={handleAddEmployee}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel Employé
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Input 
            placeholder="Rechercher un employé..." 
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
                    <TableHead>Badge</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.badgeNumber}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getDepartmentColor(employee.department)}`}>
                          {employee.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShowBarcode(employee)}>
                          <Barcode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditEmployee(employee)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => handleAddAbsence(employee)}>
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteEmployee(employee.id)}>
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
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{employee.name}</CardTitle>
                      <Badge variant="outline" className={`${getDepartmentColor(employee.department)} mt-1`}>
                        {employee.department}
                      </Badge>
                    </div>
                    <Badge className={`${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Poste:</span>
                      <span className="font-medium">{employee.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Badge:</span>
                      <span className="font-mono font-medium">{employee.badgeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{employee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Téléphone:</span>
                      <span className="font-medium">{employee.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleShowBarcode(employee)}>
                      <Barcode className="h-4 w-4 mr-2" />
                      Code-barres
                    </Button>
                    <div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditEmployee(employee)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => handleAddAbsence(employee)}>
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteEmployee(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registre de Présence - Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Badge</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Heure d'arrivée</TableHead>
                    <TableHead>Heure de départ</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.filter(e => e.status !== "Congé").map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.badgeNumber}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getDepartmentColor(employee.department)}`}>
                          {employee.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.status === "Présent" ? "08:" + Math.floor(Math.random() * 60).toString().padStart(2, '0') : "-"}</TableCell>
                      <TableCell>{employee.status === "Présent" ? "" : "-"}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="absences" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestion des Absences</CardTitle>
              <Button size="sm" onClick={() => setIsAbsenceListOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Liste complète
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Du</TableHead>
                    <TableHead>Au</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.filter(absence => 
                    !searchTerm || employees.some(emp => 
                      emp.id === absence.employeeId && 
                      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  ).slice(0, 5).map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.employeeName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getAbsenceTypeColor(absence.type)}`}>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{absence.startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{absence.endDate.toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs truncate" title={absence.motif}>{absence.motif}</TableCell>
                      <TableCell>
                        <Badge className={`${getAbsenceStatusColor(absence.status)}`}>
                          {absence.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteAbsence(absence.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {absences.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune absence enregistrée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de création/édition d'employé */}
      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={currentEmployee}
        onSave={handleSaveEmployee}
      />

      {/* Modal d'affichage de code-barres */}
      <CodeDisplay
        isOpen={isCodeDisplayOpen}
        onClose={() => setIsCodeDisplayOpen(false)}
        codeType="badge"
        code={selectedBadgeInfo.code}
        name={selectedBadgeInfo.name}
        detail={selectedBadgeInfo.department}
      />

      {/* Modal d'ajout d'absence */}
      {selectedEmployee && (
        <AbsenceForm
          isOpen={isAbsenceModalOpen}
          onClose={() => setIsAbsenceModalOpen(false)}
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          onSave={handleSaveAbsence}
        />
      )}

      {/* Dialog de la liste complète des absences */}
      <Dialog open={isAbsenceListOpen} onOpenChange={setIsAbsenceListOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Liste complète des absences</span>
              <Button variant="ghost" size="icon" onClick={() => setIsAbsenceListOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Historique et gestion des absences de tous les employés
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absences.map((absence) => (
                  <TableRow key={absence.id}>
                    <TableCell className="font-medium">{absence.employeeName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getAbsenceTypeColor(absence.type)}`}>
                        {absence.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {absence.startDate.toLocaleDateString()} - {absence.endDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={absence.motif}>
                      {absence.motif}
                    </TableCell>
                    <TableCell>{absence.justification || "-"}</TableCell>
                    <TableCell>
                      <Badge className={`${getAbsenceStatusColor(absence.status)}`}>
                        {absence.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteAbsence(absence.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {absences.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune absence enregistrée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setIsAbsenceListOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter les absences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Employees;
