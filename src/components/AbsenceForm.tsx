
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AbsenceFormProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: number;
  employeeName?: string;
  onSave: (absenceData: AbsenceData) => Promise<void>;
}

export interface AbsenceData {
  id?: number;
  employeeId: number;
  employeeName: string;
  type: string;
  startDate: Date;
  endDate: Date;
  motif: string;
  justification?: string;
  status: 'En attente' | 'Approuvé' | 'Rejeté';
}

const absenceTypes = [
  "Maladie",
  "Congé payé",
  "Congé sans solde",
  "Formation",
  "Mission",
  "Raison personnelle",
  "Autre"
];

export default function AbsenceForm({ 
  isOpen, 
  onClose, 
  employeeId = 0, 
  employeeName = "",
  onSave 
}: AbsenceFormProps) {
  const [formData, setFormData] = useState<Partial<AbsenceData>>({
    employeeId,
    employeeName,
    type: "Maladie",
    motif: "",
    justification: "",
    status: "En attente",
    startDate: new Date(),
    endDate: new Date(),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeId || !formData.type || !formData.motif || !formData.startDate || !formData.endDate) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    // Vérifier que la date de fin n'est pas antérieure à la date de début
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      toast({
        title: "Erreur de validation",
        description: "La date de fin ne peut pas être antérieure à la date de début.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData as AbsenceData);
      toast({
        title: "Absence enregistrée",
        description: "L'absence a été enregistrée avec succès."
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'absence:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'absence. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer une absence</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour enregistrer une absence pour {employeeName || "l'employé"}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'absence</Label>
              <Select 
                value={formData.type || "Maladie"} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {absenceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status || "En attente"} 
                onValueChange={(value) => handleChange("status", value as 'En attente' | 'Approuvé' | 'Rejeté')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Approuvé">Approuvé</SelectItem>
                  <SelectItem value="Rejeté">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "P", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "P", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motif">Motif</Label>
            <Textarea
              id="motif"
              placeholder="Décrivez brièvement le motif de l'absence"
              value={formData.motif || ""}
              onChange={(e) => handleChange("motif", e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="justification">
              Justification <span className="text-sm text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="justification"
              placeholder="Document ou référence justificative"
              value={formData.justification || ""}
              onChange={(e) => handleChange("justification", e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer l'absence"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
