
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
  Search,
  LogOut,
  FileText,
  BarChart3,
  CalendarDays
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeScannerEnhanced from '@/components/CodeScannerEnhanced';
import { toast } from "@/hooks/use-toast";

// Define proper types
type AttendanceRecord = {
  id: number;
  type: string;
  code: string;
  name: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
} & (
  { type: "Employé"; department: string; service?: never; } | 
  { type: "Client"; service: string; department?: never; }
);

const attendanceData: AttendanceRecord[] = [
  { id: 1, type: "Employé", code: "EMP001", name: "Jean Dupont", department: "Administration", date: "18/06/2023", timeIn: "08:15", timeOut: "17:30", status: "Complet" },
  { id: 2, type: "Employé", code: "EMP003", name: "Pierre Thomas", department: "Hôtel", date: "18/06/2023", timeIn: "08:05", timeOut: "17:15", status: "Complet" },
  { id: 3, type: "Employé", code: "EMP005", name: "Ahmed Bensaid", department: "Salle de conférence", date: "18/06/2023", timeIn: "08:22", timeOut: "17:45", status: "Complet" },
  { id: 4, type: "Employé", code: "EMP006", name: "Lucie Dubois", department: "Salle de fête", date: "18/06/2023", timeIn: "08:17", timeOut: "17:25", status: "Complet" },
  { id: 5, type: "Client", code: "CL001", name: "Patrick Durand", service: "Hôtel", date: "18/06/2023", timeIn: "10:15", timeOut: "", status: "En cours" },
  { id: 6, type: "Client", code: "CL002", name: "Carole Petit", service: "Restaurant", date: "18/06/2023", timeIn: "12:30", timeOut: "14:15", status: "Complet" },
  { id: 7, type: "Client", code: "CL006", name: "Julie Moreau", service: "Hôtel", date: "18/06/2023", timeIn: "09:45", timeOut: "", status: "En cours" },
  { id: 8, type: "Employé", code: "EMP002", name: "Marie Martin", department: "Restaurant", date: "18/06/2023", timeIn: "", timeOut: "", status: "Absent" },
  { id: 9, type: "Employé", code: "EMP008", name: "Fatima Nasser", department: "Restaurant", date: "18/06/2023", timeIn: "", timeOut: "", status: "Absent" },
];

const getLabelColor = (type: string) => {
  return type === "Employé" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
};

const getStatusColor = (status: string) => {
  const colors = {
    "Complet": "bg-green-100 text-green-800",
    "En cours": "bg-amber-100 text-amber-800",
    "Retard": "bg-orange-100 text-orange-800",
    "Absent": "bg-red-100 text-red-800"
  };
  
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(attendanceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subFilter, setSubFilter] = useState('all'); // Pour filtrer par département ou service
  const [periodFilter, setPeriodFilter] = useState('today');
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [scanTab, setScanTab] = useState<"barcode" | "qrcode">("barcode");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Obtenir tous les départements et services uniques
  const departments = Array.from(new Set(
    records
      .filter(r => r.type === "Employé" && 'department' in r)
      .map(r => r.department)
  ));
  
  const services = Array.from(new Set(
    records
      .filter(r => r.type === "Client" && 'service' in r)
      .map(r => r.service)
  ));

  // Filtrer les enregistrements
  const filteredRecords = records.filter(record => {
    // Filtre de recherche
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.department && record.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.service && record.service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre de type
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'employee' && record.type === 'Employé') ||
      (typeFilter === 'client' && record.type === 'Client');
    
    // Filtre secondaire (département ou service)
    const matchesSubFilter = subFilter === 'all' || 
      (record.type === 'Employé' && 'department' in record && record.department === subFilter) ||
      (record.type === 'Client' && 'service' in record && record.service === subFilter);
    
    return matchesSearch && matchesType && matchesSubFilter;
  });

  // Gérer un scan réussi
  const handleScanSuccess = (code: string, action: "in" | "out") => {
    // Déterminer si c'est un code d'employé ou de client
    const isEmployee = code.startsWith("EMP");
    
    // Heure actuelle
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    
    // Trouver l'enregistrement existant pour aujourd'hui s'il existe
    const existingRecord = records.find(r => 
      r.code === code && r.date === date
    );
    
    if (existingRecord) {
      // Mettre à jour l'enregistrement existant
      const updatedRecords = records.map(record => {
        if (record.id === existingRecord.id) {
          if (action === "in" && !record.timeIn) {
            // Entrée
            return { ...record, timeIn: time, status: "En cours" };
          } else if (action === "out" && record.timeIn) {
            // Sortie
            return { ...record, timeOut: time, status: "Complet" };
          }
        }
        return record;
      });
      
      setRecords(updatedRecords);
    } else {
      // Créer un nouvel enregistrement
      // Dans une application réelle, nous rechercherions les détails de l'employé/client à partir du code
      const baseRecord = {
        id: records.length + 1,
        code,
        name: isEmployee ? "Nouvel Employé" : "Nouveau Client", // Dans une vraie app, on récupérerait le nom
        date,
        timeIn: action === "in" ? time : "",
        timeOut: action === "out" ? time : "",
        status: action === "in" ? "En cours" : (action === "out" ? "Complet" : "Inconnu"),
      };
      
      const newRecord: AttendanceRecord = isEmployee 
        ? { 
            ...baseRecord, 
            type: "Employé", 
            department: "Inconnu" // Dans une vraie app, on récupérerait le département
          } 
        : { 
            ...baseRecord, 
            type: "Client", 
            service: "Inconnu" // Dans une vraie app, on récupérerait le service
          };
      
      setRecords([...records, newRecord]);
    }
    
    // Ajouter aux scans récents
    const scan = {
      id: Date.now(),
      type: isEmployee ? "Employé" : "Client",
      code,
      name: existingRecord?.name || (isEmployee ? "Employé" : "Client"),
      action,
      time,
    };
    
    setRecentScans([scan, ...recentScans.slice(0, 2)]); // Garder seulement les 3 scans les plus récents
    
    // Notification
    toast({
      title: `${isEmployee ? "Employé" : "Client"} ${action === "in" ? "arrivé" : "parti"}`,
      description: `${scan.name} (${code}) a été enregistré à ${time}.`,
    });
  };

  // Fonction pour télécharger un rapport
  const handleDownloadReport = (reportName: string) => {
    setSelectedReport(reportName);
    setIsDownloading(true);
    
    // Simuler un délai de téléchargement
    setTimeout(() => {
      toast({
        title: "Rapport téléchargé",
        description: `Le rapport "${reportName}" a été téléchargé avec succès.`,
      });
      setIsDownloading(false);
      setSelectedReport(null);
    }, 1500);
  };

  // Fonction pour se déconnecter
  const handleLogout = () => {
    setShowLogoutModal(true);
    
    // Dans une vraie application, vous déconnecteriez l'utilisateur ici
    setTimeout(() => {
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès.",
      });
      setShowLogoutModal(false);
      // Redirection vers la page de connexion
      // window.location.href = "/login";
    }, 1500);
  };

  return (
    <MainLayout title="Gestion de Présence">
      <Tabs defaultValue="registry" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="registry">Registre</TabsTrigger>
            <TabsTrigger value="scan">Scanner</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Aujourd'hui
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
        
        <TabsContent value="registry" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Présence Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8% par rapport à hier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Employés Présents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35/50</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Taux de présence: 70%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clients Enregistrés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3 à l'hôtel, 4 au restaurant
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Dernière Arrivée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12:30</div>
                <p className="text-xs text-muted-foreground mt-1">
                  il y a 15 minutes
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Registre de Présence</CardTitle>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setTypeFilter('all')}>Tous</TabsTrigger>
                  <TabsTrigger value="employees" onClick={() => setTypeFilter('employee')}>Employés</TabsTrigger>
                  <TabsTrigger value="clients" onClick={() => setTypeFilter('client')}>Clients</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center space-x-2 mb-4">
                <Input 
                  placeholder="Rechercher..." 
                  className="max-w-sm" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select 
                  value={periodFilter}
                  onValueChange={(value) => setPeriodFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="yesterday">Hier</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
                
                {typeFilter === 'employee' && (
                  <Select 
                    value={subFilter}
                    onValueChange={(value) => setSubFilter(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les départements</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {typeFilter === 'client' && (
                  <Select 
                    value={subFilter}
                    onValueChange={(value) => setSubFilter(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les services</SelectItem>
                      {services.map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Département/Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Entrée</TableHead>
                    <TableHead>Sortie</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Badge variant="outline" className={`${getLabelColor(record.type)}`}>
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{record.code}</TableCell>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.department || record.service}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.timeIn || "-"}</TableCell>
                        <TableCell>{record.timeOut || "-"}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(record.status)}`}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucun enregistrement ne correspond aux critères sélectionnés
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scan" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Button 
              variant={scanTab === 'barcode' ? 'default' : 'outline'} 
              className={`h-16 ${scanTab === 'barcode' ? 'bg-blue-600 hover:bg-blue-700' : ''}`} 
              onClick={() => setScanTab('barcode')}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">Scanner un Code-barres</span>
                <span className="text-xs">Pour les employés</span>
              </div>
            </Button>
            
            <Button 
              variant={scanTab === 'qrcode' ? 'default' : 'outline'} 
              className={`h-16 ${scanTab === 'qrcode' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={() => setScanTab('qrcode')}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">Scanner un QR Code</span>
                <span className="text-xs">Pour les clients</span>
              </div>
            </Button>
          </div>
          
          <CodeScannerEnhanced 
            type={scanTab} 
            onScanSuccess={handleScanSuccess}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Derniers Enregistrements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Heure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentScans.length > 0 ? (
                    recentScans.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell>
                          <Badge variant="outline" className={getLabelColor(scan.type)}>
                            {scan.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{scan.code}</TableCell>
                        <TableCell className="font-medium">{scan.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={scan.action === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {scan.action === "in" ? "Entrée" : "Sortie"}
                          </Badge>
                        </TableCell>
                        <TableCell>{scan.time}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Aucun scan récent. Utilisez les scanners ci-dessus pour enregistrer des entrées/sorties.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Rapport Mensuel</CardTitle>
                <CardDescription>Tendance de présence pour le mois en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Chart placeholder - Dans une application réelle, utilisez Recharts */}
                  <div className="h-full w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex flex-col items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-blue-500 mb-2 opacity-50" />
                    <p className="text-blue-600 font-medium">Graphique de tendance mensuelle</p>
                    <p className="text-sm text-muted-foreground">Les données sont disponibles dans les rapports téléchargeables</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rapports Disponibles</CardTitle>
                <CardDescription>Téléchargez les analyses détaillées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "Rapport journalier", icon: CalendarIcon },
                    { name: "Rapport hebdomadaire", icon: CalendarDays },
                    { name: "Rapport mensuel", icon: BarChart3 },
                    { name: "Rapport par service", icon: FileText },
                    { name: "Rapport d'absences", icon: Clock },
                    { name: "Rapport personnalisé", icon: FileText }
                  ].map((report, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start"
                      disabled={isDownloading && selectedReport === report.name}
                      onClick={() => handleDownloadReport(report.name)}
                    >
                      {isDownloading && selectedReport === report.name ? (
                        <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <report.icon className="h-4 w-4 mr-2" />
                      )}
                      {report.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques par Département</CardTitle>
              <CardDescription>Analyse de présence par département</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Département</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Présents</TableHead>
                    <TableHead>Absents</TableHead>
                    <TableHead>Taux</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Administration</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>87.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hôtel</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>83.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Restaurant</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>66.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Salles</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>80%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Production d'eau</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>80%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Déconnexion en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="mb-4 size-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
                <p>Déconnexion de l'application...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default Attendance;
