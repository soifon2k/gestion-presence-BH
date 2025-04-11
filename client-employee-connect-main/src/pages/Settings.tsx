
import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Building2, Save, Download, Upload, Trash2, HelpCircle, Map, Phone, Clock, Calendar, Mail, Globe } from "lucide-react";

// Type pour les informations de l'entreprise
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

const Settings = () => {
  // État pour les informations de l'entreprise
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

  // Fonction pour sauvegarder les informations
  const saveCompanyInfo = () => {
    // Sauvegarde dans localStorage pour persistance
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    
    toast({
      title: "Informations sauvegardées",
      description: "Les informations de l'entreprise ont été sauvegardées avec succès.",
    });
  };

  // Charger les informations au chargement de la page
  useEffect(() => {
    const savedInfo = localStorage.getItem('companyInfo');
    if (savedInfo) {
      setCompanyInfo(JSON.parse(savedInfo));
    }
  }, []);

  return (
    <MainLayout title="Paramètres">
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="help">Aide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Ces informations seront affichées dans le tableau de bord et les rapports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input 
                    id="company-name" 
                    value={companyInfo.name} 
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Logo (texte abrégé)</Label>
                  <Input 
                    id="company-logo" 
                    value={companyInfo.logo} 
                    maxLength={3}
                    onChange={(e) => setCompanyInfo({...companyInfo, logo: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company-description">Description</Label>
                  <Textarea 
                    id="company-description" 
                    value={companyInfo.description} 
                    onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Adresse</Label>
                  <Input 
                    id="company-address" 
                    value={companyInfo.address} 
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Téléphone</Label>
                  <Input 
                    id="company-phone" 
                    value={companyInfo.phone} 
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input 
                    id="company-email" 
                    type="email" 
                    value={companyInfo.email} 
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Site Web</Label>
                  <Input 
                    id="company-website" 
                    value={companyInfo.website} 
                    onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-hours">Heures d'ouverture</Label>
                  <Input 
                    id="company-hours" 
                    value={companyInfo.openingHours} 
                    onChange={(e) => setCompanyInfo({...companyInfo, openingHours: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-year">Année d'établissement</Label>
                  <Input 
                    id="company-year" 
                    value={companyInfo.establishedYear} 
                    onChange={(e) => setCompanyInfo({...companyInfo, establishedYear: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Réinitialiser</Button>
              <Button onClick={saveCompanyInfo}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select 
                  value={companyInfo.theme} 
                  onValueChange={(value) => setCompanyInfo({...companyInfo, theme: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Bleu</SelectItem>
                    <SelectItem value="green">Vert</SelectItem>
                    <SelectItem value="purple">Violet</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Réinitialiser</Button>
              <Button onClick={saveCompanyInfo}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>
                Importez ou exportez les données de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exporter les données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Téléchargez toutes vos données dans un fichier JSON ou CSV.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => {
                        toast({
                          title: "Exportation en cours",
                          description: "Les données sont en cours d'exportation au format JSON.",
                        });
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        Format JSON
                      </Button>
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "Exportation en cours",
                          description: "Les données sont en cours d'exportation au format CSV.",
                        });
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        Format CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Importer des données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Importez des données à partir d'un fichier JSON ou CSV.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => {
                        toast({
                          title: "Importation",
                          description: "Fonctionnalité d'importation en cours de développement.",
                        });
                      }}>
                        <Upload className="mr-2 h-4 w-4" />
                        Importer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-red-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg text-red-500">Zone de danger</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ces actions sont irréversibles. Procédez avec prudence.
                  </p>
                  <Button variant="destructive" onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les données? Cette action est irréversible.")) {
                      toast({
                        title: "Données supprimées",
                        description: "Toutes les données ont été supprimées.",
                      });
                    }
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer toutes les données
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Aide et support</CardTitle>
              <CardDescription>
                Obtenez de l'aide pour utiliser l'application GestiPrésence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4" onClick={() => {
                  toast({
                    title: "Documentation",
                    description: "La documentation sera disponible prochainement.",
                  });
                }}>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center mb-1">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Documentation</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Consultez le guide d'utilisation complet
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-4" onClick={() => {
                  toast({
                    title: "Support technique",
                    description: "Une demande de support sera envoyée à notre équipe technique.",
                  });
                }}>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center mb-1">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Support technique</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contactez notre équipe pour obtenir de l'aide
                    </p>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 space-y-3 border p-4 rounded-lg">
                <h3 className="font-semibold">À propos de GestiPrésence</h3>
                <p className="text-sm text-muted-foreground">
                  GestiPrésence est un système de gestion de présence développé par GestiPrésence Inc.
                  Version 1.0.0
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
