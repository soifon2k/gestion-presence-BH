
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hotel, Calendar, CreditCard, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import CodeDisplay from "@/components/CodeDisplay";

interface HotelRegistrationFormProps {
  onSubmit?: (data: any) => void;
}

const roomTypes = [
  "Chambre Simple",
  "Chambre Double",
  "Suite Junior",
  "Suite Exécutive",
  "Appartement",
  "Villa"
];

const paymentTypes = [
  "Carte de crédit",
  "Espèces",
  "Virement bancaire",
  "Mobile Money",
  "Chèque"
];

const HotelRegistrationForm: React.FC<HotelRegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: "",
    postnom: "",
    prenom: "",
    telephone: "",
    typeChambre: "",
    numeroChambre: "",
    dateArrivee: new Date(),
    dateDepart: new Date(new Date().setDate(new Date().getDate() + 1)),
    typePayement: "",
    montant: ""
  });
  
  const [showQRCode, setShowQRCode] = useState(false);
  const [clientCode, setClientCode] = useState("");
  
  const handleChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateClientCode = () => {
    const prefix = "CL";
    const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${prefix}${randomNum}`;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base
    if (!formData.nom || !formData.telephone || !formData.typeChambre || !formData.typePayement) {
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const newClientCode = generateClientCode();
    setClientCode(newClientCode);
    
    if (onSubmit) {
      onSubmit({ ...formData, code: newClientCode });
    }
    
    toast({
      title: "Client enregistré",
      description: `${formData.nom} ${formData.prenom} a été enregistré avec succès.`,
    });
    
    setShowQRCode(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full text-blue-700">
              <Hotel size={20} />
            </div>
            <div>
              <CardTitle>Enregistrement Client Hôtel</CardTitle>
              <CardDescription>Enregistrez un nouveau client pour le service hôtel</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom*</Label>
                  <Input 
                    id="nom" 
                    placeholder="Ex: Dupont" 
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postnom">Post-nom</Label>
                  <Input 
                    id="postnom" 
                    placeholder="Ex: Jean" 
                    value={formData.postnom}
                    onChange={(e) => handleChange("postnom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input 
                    id="prenom" 
                    placeholder="Ex: Pierre" 
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="telephone">Numéro de téléphone*</Label>
                <Input 
                  id="telephone" 
                  placeholder="Ex: +243 999 999 999" 
                  value={formData.telephone}
                  onChange={(e) => handleChange("telephone", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t">
              <h3 className="text-sm font-medium text-gray-500">Informations de séjour</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeChambre">Type de chambre*</Label>
                  <Select 
                    value={formData.typeChambre}
                    onValueChange={(value) => handleChange("typeChambre", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de chambre" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroChambre">Numéro de chambre*</Label>
                  <Input 
                    id="numeroChambre" 
                    placeholder="Ex: A101" 
                    value={formData.numeroChambre}
                    onChange={(e) => handleChange("numeroChambre", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Date d'arrivée*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.dateArrivee ? (
                          format(formData.dateArrivee, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionnez une date d'arrivée</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.dateArrivee}
                        onSelect={(date) => date && handleChange("dateArrivee", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Date de départ*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.dateDepart ? (
                          format(formData.dateDepart, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionnez une date de départ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.dateDepart}
                        onSelect={(date) => date && handleChange("dateDepart", date)}
                        initialFocus
                        disabled={(date) => date < formData.dateArrivee}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t">
              <h3 className="text-sm font-medium text-gray-500">Informations de paiement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typePayement">Type de paiement*</Label>
                  <Select 
                    value={formData.typePayement}
                    onValueChange={(value) => handleChange("typePayement", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montant">Montant ($)*</Label>
                  <Input 
                    id="montant" 
                    placeholder="Ex: 150" 
                    type="number"
                    min="0"
                    value={formData.montant}
                    onChange={(e) => handleChange("montant", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline">Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </CardFooter>
        </form>
      </Card>

      {/* Affichage du QR code après enregistrement */}
      {clientCode && (
        <CodeDisplay
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          codeType="qr"
          code={clientCode}
          name={`${formData.nom} ${formData.prenom}`}
          detail={`${formData.typeChambre}, Chambre ${formData.numeroChambre}`}
          showButtons={true}
        />
      )}
    </>
  );
};

export default HotelRegistrationForm;
