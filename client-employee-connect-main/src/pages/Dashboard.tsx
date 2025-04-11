
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DashboardStats from '@/components/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Users, Calendar, Hotel, Utensils, Droplet, 
         UserCheck, Presentation, Download, ChevronRight, PieChart, BarChart4,
         QrCode, Barcode, Building2, Phone, Mail, Globe, Map, Clock, FileText } from "lucide-react";
import CodeScannerWithBadge from '@/components/CodeScannerWithBadge';
import CodeDisplay from '@/components/CodeDisplay';
import { toast } from "@/hooks/use-toast";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface CompanyInfo {
  name: string;
  logo: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
  establishedYear: string;
  theme: string;
}

const Dashboard = () => {
  // Move all state declarations inside the component function
  const [scanTab, setScanTab] = useState<"barcode" | "qrcode">("barcode");
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<{
    type: "badge" | "qr";
    code: string;
    name: string;
    detail: string;
  } | null>(null);
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "GestiPrésence Inc.",
    logo: "GP",
    description: "Système de gestion de présence pour employés et clients",
    address: "123 Rue Principale, Ville, Pays",
    phone: "+123 456 7890",
    email: "contact@gestipresence.com",
    website: "www.gestipresence.com",
    openingHours: "Lun-Ven: 8h-18h",
    establishedYear: "2022",
    theme: "blue",
  });

  // Historique des présences
  const [presentRecords, setPresentRecords] = useState<Array<{
    type: string, 
    code: string, 
    name: string, 
    action: string, 
    time: string,
    timestamp: string,
    department?: string,
    service?: string
  }>>([
    { type: "Employé", code: "EMP003", name: "Pierre Thomas", action: "entrée", time: "08:05", timestamp: "2025-04-08 08:05", department: "Hôtel" },
    { type: "Client", code: "CL006", name: "Julie Moreau", action: "entrée", time: "09:45", timestamp: "2025-04-08 09:45", service: "Hôtel" },
    { type: "Employé", code: "EMP005", name: "Ahmed Bensaid", action: "entrée", time: "08:22", timestamp: "2025-04-08 08:22", department: "Conférences" },
    { type: "Client", code: "CL002", name: "Carole Petit", action: "entrée", time: "12:30", timestamp: "2025-04-08 12:30", service: "Restaurant" },
    { type: "Employé", code: "EMP001", name: "Jean Dupont", action: "sortie", time: "17:30", timestamp: "2025-04-08 17:30", department: "Administration" }
  ]);
  
  // Services et leurs statistiques - moved inside component
  const serviceStats = [
    {
      name: "Hôtel",
      icon: Hotel,
      color: "bg-purple-100 text-purple-600",
      stats: [
        { label: "Occupation", value: "85%" },
        { label: "Disponibilité", value: "15%" },
        { label: "Clients", value: "42" },
      ]
    },
    {
      name: "Restaurant",
      icon: Utensils,
      color: "bg-orange-100 text-orange-600",
      stats: [
        { label: "Réservations", value: "18" },
        { label: "Tables libres", value: "8" },
        { label: "Repas servis", value: "124" },
      ]
    },
    {
      name: "Production d'eau",
      icon: Droplet,
      color: "bg-sky-100 text-sky-600",
      stats: [
        { label: "Production", value: "4200 L" },
        { label: "Distribution", value: "3800 L" },
        { label: "Stock", value: "12500 L" },
      ]
    },
    {
      name: "Salles de conférence",
      icon: Presentation,
      color: "bg-pink-100 text-pink-600",
      stats: [
        { label: "Réservations", value: "3" },
        { label: "Salles disponibles", value: "1" },
        { label: "Prochaine réunion", value: "14:00" },
      ]
    }
  ];

  // Données pour les graphiques - moved inside component
  const presenceData = [
    { name: 'Lundi', employees: 42, clients: 28 },
    { name: 'Mardi', employees: 45, clients: 24 },
    { name: 'Mercredi', employees: 47, clients: 32 },
    { name: 'Jeudi', employees: 44, clients: 38 },
    { name: 'Vendredi', employees: 48, clients: 42 },
    { name: 'Samedi', employees: 38, clients: 54 },
    { name: 'Dimanche', employees: 35, clients: 48 },
  ];

  const serviceData = [
    { name: 'Hôtel', value: 42 },
    { name: 'Restaurant', value: 28 },
    { name: 'Conférences', value: 15 },
    { name: 'Événements', value: 8 },
    { name: 'Production d\'eau', value: 7 },
  ];

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  // Rapports disponibles - moved inside component
  const availableReports = [
    { 
      id: 'daily',
      title: "Rapport journalier", 
      description: "Présence du jour courant", 
      format: "PDF",
      data: {
        presences: { employes: 42, clients: 24 },
        services: { hotel: 85, restaurant: 32, conferences: 2, events: 1, water: 4200 }
      }
    },
    { 
      id: 'weekly',
      title: "Rapport hebdomadaire", 
      description: "Résumé de la semaine", 
      format: "Excel",
      data: {
        presenceTotal: { employes: 250, clients: 178 },
        moyenneJournaliere: { employes: 35.7, clients: 25.4 }
      }
    },
    { 
      id: 'monthly',
      title: "Rapport mensuel", 
      description: "Statistiques et tendances", 
      format: "PDF",
      data: {
        presenceTotal: { employes: 1050, clients: 720 },
        evolution: "+15% par rapport au mois précédent"
      }
    },
    { 
      id: 'service',
      title: "Rapport par service", 
      description: "Activité par département", 
      format: "Excel",
      data: serviceStats
    },
    { 
      id: 'absence',
      title: "Rapport d'absences", 
      description: "Liste et motifs des absences", 
      format: "PDF",
      data: {
        totalAbsences: 8,
        motifs: { maladie: 4, conges: 2, formation: 1, autre: 1 }
      }
    }
  ];

  // Charger les informations de l'entreprise au chargement
  useEffect(() => {
    const savedInfo = localStorage.getItem('companyInfo');
    if (savedInfo) {
      try {
        setCompanyInfo(JSON.parse(savedInfo));
      } catch (e) {
        console.error("Erreur lors du chargement des informations:", e);
      }
    }
  }, []);
  
  // Gérer l'enregistrement d'un scan réussi
  const handleScanSuccess = (code: string, action: "in" | "out", timestamp: string) => {
    // Extraire l'heure
    const time = timestamp.split(' ')[1];
    
    // Déterminer si c'est un employé ou un client
    const isEmployee = code.startsWith('EMP');
    
    // Simuler la récupération des infos selon le code
    let name = "";
    let department = "";
    let service = "";
    
    if (isEmployee) {
      // Recherche parmi les employés simulés
      if (code === "EMP001") { name = "Jean Dupont"; department = "Administration"; }
      else if (code === "EMP002") { name = "Marie Martin"; department = "Restaurant"; }
      else if (code === "EMP003") { name = "Pierre Thomas"; department = "Hôtel"; }
      else if (code === "EMP004") { name = "Sophie Laurent"; department = "Production d'eau"; }
      else if (code === "EMP005") { name = "Ahmed Bensaid"; department = "Conférences"; }
    } else {
      // Recherche parmi les clients simulés
      if (code === "CL001") { name = "Patrick Durand"; service = "Hôtel"; }
      else if (code === "CL002") { name = "Carole Petit"; service = "Restaurant"; }
      else if (code === "CL003") { name = "Thomas Girard"; service = "Conférences"; }
      else if (code === "CL004") { name = "Julie Moreau"; service = "Événements"; }
      else if (code === "CL005") { name = "Marc Lefevre"; service = "Restaurant"; }
      else if (code === "CL006") { name = "Emma Richard"; service = "Hôtel"; }
    }
    
    // Créer un nouvel enregistrement
    const newRecord = {
      type: isEmployee ? "Employé" : "Client",
      code,
      name,
      action: action === "in" ? "entrée" : "sortie",
      time,
      timestamp,
      department,
      service
    };
    
    // Mettre à jour la liste des présences
    setPresentRecords(prev => [newRecord, ...prev]);
    
    // Notification
    toast({
      title: `${isEmployee ? "Employé" : "Client"} enregistré`,
      description: `${name} (${code}) - ${action === "in" ? "Entrée" : "Sortie"} à ${time}.`,
    });
    
    console.log(`Code ${code} scanné. Action: ${action}, Horodatage: ${timestamp}`);
  };

  // Afficher un badge
  const handleViewBadge = (type: "badge" | "qr", code: string, name: string, detail: string) => {
    setSelectedBadge({
      type,
      code,
      name,
      detail
    });
    setShowBadgeModal(true);
  };

  // Télécharger un rapport
  const downloadReport = (reportId: string) => {
    // Trouver le rapport
    const report = availableReports.find(r => r.id === reportId);
    
    if (!report) {
      toast({
        title: "Erreur",
        description: "Rapport non trouvé",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Téléchargement démarré",
      description: `Le rapport "${report.title}" est en cours de téléchargement.`,
    });
    
    // Simuler un délai de téléchargement
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: `Le rapport "${report.title}" a été téléchargé avec succès.`,
      });
      
      // Générer un rapport simulé
      if (report.format === "PDF") {
        simulatePdfDownload(report);
      } else {
        simulateExcelDownload(report);
      }
    }, 1500);
  };
  
  // Simuler le téléchargement d'un PDF
  const simulatePdfDownload = (report: any) => {
    const date = new Date().toLocaleDateString('fr-FR');
    
    // Dans une vraie application, ici on générerait un vrai PDF
    // Pour cette démo, on crée simplement une page HTML qui ressemble à un PDF
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title} - ${date}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          .header { border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          .company { font-size: 24px; font-weight: bold; }
          .logo { font-size: 36px; background: #f0f0f0; padding: 10px; border-radius: 50%; display: inline-block; width: 50px; height: 50px; text-align: center; line-height: 50px; margin-right: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
          .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center;">
            <div class="logo">${companyInfo.logo}</div>
            <div class="company">${companyInfo.name}</div>
          </div>
          <p>${companyInfo.description}</p>
        </div>
        
        <h1>${report.title}</h1>
        <p>Date: ${date}</p>
        <p>${report.description}</p>
        
        <h2>Données du rapport</h2>
        <p>Ce rapport contient des informations générées pour la démonstration.</p>
        
        <div class="footer">
          <p>Généré par GestiPrésence - ${date}</p>
          <p>${companyInfo.address} | ${companyInfo.phone} | ${companyInfo.email}</p>
        </div>
      </body>
      </html>
    `;
    
    // Créer un Blob pour le contenu HTML
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_rapport_${date.replace(/\//g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Simuler le téléchargement d'un fichier Excel
  const simulateExcelDownload = (report: any) => {
    const date = new Date().toLocaleDateString('fr-FR');
    
    // Dans une application réelle, nous utiliserions une bibliothèque comme xlsx
    // Pour cette démo, créer un fichier CSV simple
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // En-tête
    csvContent += `${report.title} - ${date}\r\n`;
    csvContent += `${report.description}\r\n\r\n`;
    
    // Ajouter des données fictives selon le rapport
    if (report.id === 'weekly') {
      csvContent += "Jour,Employés,Clients\r\n";
      csvContent += "Lundi,42,28\r\n";
      csvContent += "Mardi,45,24\r\n";
      csvContent += "Mercredi,47,32\r\n";
      csvContent += "Jeudi,44,38\r\n";
      csvContent += "Vendredi,48,42\r\n";
      csvContent += "Samedi,38,54\r\n";
      csvContent += "Dimanche,35,48\r\n";
      csvContent += "\r\nTotal,299,266\r\n";
      csvContent += "Moyenne,42.7,38.0\r\n";
    } else if (report.id === 'service') {
      csvContent += "Service,Occupation,Clients,Réservations\r\n";
      csvContent += "Hôtel,85%,42,38\r\n";
      csvContent += "Restaurant,75%,28,18\r\n";
      csvContent += "Conférences,66%,15,3\r\n";
      csvContent += "Événements,50%,8,4\r\n";
      csvContent += "Production d'eau,90%,7,0\r\n";
    }
    
    // Créer un lien de téléchargement
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.id}_rapport_${date.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout title="Tableau de Bord">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-100 p-2 rounded-full h-12 w-12`}>
              {companyInfo.logo}
            </div>
            <h2 className="text-2xl font-bold text-blue-600">{companyInfo.name}</h2>
          </div>
          <div className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        <DashboardStats />
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="overview" className="bg-white">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="services" className="bg-white">Services</TabsTrigger>
            <TabsTrigger value="scan" className="bg-white">Scanner un code</TabsTrigger>
            <TabsTrigger value="reports" className="bg-white">Rapports</TabsTrigger>
            <TabsTrigger value="stats" className="bg-white">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <CardTitle>Présence Aujourd'hui</CardTitle>
                    <CardDescription>Employés et clients présents aujourd'hui</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    const tab = document.querySelector('[data-value="scan"]');
                    if (tab) {
                      (tab as HTMLElement).click();
                    }
                  }}>
                    <Barcode className="h-4 w-4 mr-2" />
                    Scanner
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presentRecords.map((activity, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Badge variant="outline" className={activity.type === "Employé" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                              {activity.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{activity.code}</TableCell>
                          <TableCell className="font-medium">{activity.name}</TableCell>
                          <TableCell>{activity.department || activity.service}</TableCell>
                          <TableCell>{activity.time}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={activity.action === "entrée" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewBadge(
                                activity.type === "Employé" ? "badge" : "qr",
                                activity.code,
                                activity.name,
                                activity.department || activity.service || ""
                              )}
                            >
                              Voir Badge
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Résumé d'Activité</CardTitle>
                  <CardDescription>Vue d'ensemble des activités</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <Users className="h-4 w-4" />
                        </div>
                        <span>Employés actifs</span>
                      </div>
                      <span className="font-semibold">42/50</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span>Clients enregistrés</span>
                      </div>
                      <span className="font-semibold">24</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                          <Hotel className="h-4 w-4" />
                        </div>
                        <span>Taux occupation hôtel</span>
                      </div>
                      <span className="font-semibold">85%</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                          <Utensils className="h-4 w-4" />
                        </div>
                        <span>Réservations restaurant</span>
                      </div>
                      <span className="font-semibold">18</span>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2" onClick={() => {
                      const tab = document.querySelector('[data-value="stats"]');
                      if (tab) {
                        (tab as HTMLElement).click();
                      }
                    }}>
                      <PieChart className="h-4 w-4 mr-2" />
                      Statistiques détaillées
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Bienvenue sur {companyInfo.name}</h3>
                    <p className="text-blue-600 mb-4 max-w-2xl">
                      {companyInfo.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Map className="h-4 w-4" />
                        <span>{companyInfo.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Phone className="h-4 w-4" />
                        <span>{companyInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Mail className="h-4 w-4" />
                        <span>{companyInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Globe className="h-4 w-4" />
                        <span>{companyInfo.website}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                        const tab = document.querySelector('[data-value="scan"]');
                        if (tab) {
                          (tab as HTMLElement).click();
                        }
                      }}>
                        <Barcode className="h-4 w-4 mr-2" />
                        Scanner un code
                      </Button>
                      <Button variant="outline" className="border-blue-300" onClick={() => {
                        const tab = document.querySelector('[data-value="reports"]');
                        if (tab) {
                          (tab as HTMLElement).click();
                        }
                      }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Voir les rapports
                      </Button>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-full bg-blue-600 text-white text-4xl font-bold">
                    {companyInfo.logo}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceStats.map((service, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${service.color}`}>
                          <service.icon className="h-5 w-5" />
                        </div>
                        <CardTitle>{service.name}</CardTitle>
                      </div>
                      <CardDescription>Statistiques du service</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {service.stats.map((stat, j) => (
                        <div key={j} className="space-y-1">
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="scan" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Button 
                variant={scanTab === 'barcode' ? 'default' : 'outline'} 
                className={`h-16 ${scanTab === 'barcode' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                onClick={() => setScanTab('barcode')}
              >
                <div className="flex flex-col items-center">
                  <Barcode className="h-6 w-6 mb-1" />
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
                  <QrCode className="h-6 w-6 mb-1" />
                  <span className="text-lg font-semibold">Scanner un QR Code</span>
                  <span className="text-xs">Pour les clients</span>
                </div>
              </Button>
            </div>
            
            <CodeScannerWithBadge 
              type={scanTab} 
              onScanSuccess={handleScanSuccess}
            />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Disponibles</CardTitle>
                <CardDescription>Téléchargez les analyses détaillées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableReports.map((report, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button onClick={() => downloadReport(report.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de Présence</CardTitle>
                  <CardDescription>Vue hebdomadaire des employés et clients</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={presenceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="employees" fill="#8884d8" name="Employés" />
                      <Bar dataKey="clients" fill="#82ca9d" name="Clients" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Exportation du graphique",
                      description: "Le graphique des statistiques de présence a été exporté.",
                    });
                    
                    // Simuler l'exportation
                    setTimeout(() => {
                      const link = document.createElement('a');
                      link.href = "data:text/plain;charset=utf-8,Données exportées pour analyse";
                      link.download = "presence_stats.csv";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }, 1000);
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribution par Service</CardTitle>
                  <CardDescription>Répartition des clients par service</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} clients`, name]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Exportation du graphique",
                      description: "Le graphique de distribution par service a été exporté.",
                    });
                    
                    // Simuler l'exportation
                    setTimeout(() => {
                      const link = document.createElement('a');
                      link.href = "data:text/plain;charset=utf-8,Données exportées pour analyse";
                      link.download = "service_distribution.csv";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }, 1000);
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Évolution de l'Activité</CardTitle>
                  <CardDescription>Tendances mensuelles de présence et services</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', hotel: 65, restaurant: 42, conference: 28, events: 15, water: 20 },
                        { month: 'Fév', hotel: 59, restaurant: 39, conference: 32, events: 12, water: 22 },
                        { month: 'Mar', hotel: 80, restaurant: 50, conference: 35, events: 20, water: 25 },
                        { month: 'Avr', hotel: 81, restaurant: 55, conference: 42, events: 22, water: 30 },
                        { month: 'Mai', hotel: 76, restaurant: 58, conference: 48, events: 25, water: 35 },
                        { month: 'Jun', hotel: 85, restaurant: 65, conference: 55, events: 30, water: 40 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="hotel" stroke="#8884d8" name="Hôtel" />
                      <Line type="monotone" dataKey="restaurant" stroke="#82ca9d" name="Restaurant" />
                      <Line type="monotone" dataKey="conference" stroke="#ffc658" name="Conférences" />
                      <Line type="monotone" dataKey="events" stroke="#ff8042" name="Événements" />
                      <Line type="monotone" dataKey="water" stroke="#0088fe" name="Production d'eau" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Exportation du graphique",
                      description: "Le graphique d'évolution de l'activité a été exporté.",
                    });
                    
                    // Simuler l'exportation
                    setTimeout(() => {
                      const link = document.createElement('a');
                      link.href = "data:text/plain;charset=utf-8,Données exportées pour analyse";
                      link.download = "activity_trends.csv";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }, 1000);
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal pour afficher le badge */}
      {selectedBadge && (
        <CodeDisplay 
          isOpen={showBadgeModal}
          onClose={() => setShowBadgeModal(false)}
          codeType={selectedBadge.type}
          code={selectedBadge.code}
          name={selectedBadge.name}
          detail={selectedBadge.detail}
          showButtons={true}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
