
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

interface AbsenceRecordFormProps {
  employeeId?: string;
  employeeName?: string;
  onSubmit?: (data: AbsenceFormData) => void;
  onCancel?: () => void;
}

export interface AbsenceFormData {
  employeeId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  details: string;
  attachments?: File[];
}

const absenceReasons = [
  "Maladie",
  "Congé payé",
  "Congé sans solde",
  "Formation",
  "Événement familial",
  "Rendez-vous médical",
  "Autre"
];

const AbsenceRecordForm: React.FC<AbsenceRecordFormProps> = ({ 
  employeeId = "", 
  employeeName = "", 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<AbsenceFormData>({
    employeeId: employeeId,
    employeeName: employeeName,
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
    details: "",
    attachments: []
  });
  
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.employeeName) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un employé.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.reason) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un motif d'absence.",
        variant: "destructive"
      });
      return;
    }
    
    // Vérifier que la date de fin n'est pas antérieure à la date de début
    if (formData.endDate < formData.startDate) {
      toast({
        title: "Erreur",
        description: "La date de fin ne peut pas être antérieure à la date de début.",
        variant: "destructive"
      });
      return;
    }
    
    // Appeler le callback avec les données du formulaire
    if (onSubmit) {
      onSubmit({...formData, attachments: files});
    }
    
    // Afficher une confirmation
    toast({
      title: "Absence enregistrée",
      description: `L'absence de ${formData.employeeName} a été enregistrée avec succès.`,
    });
    
    // Réinitialiser le formulaire
    setFormData({
      employeeId: "",
      employeeName: "",
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      details: "",
      attachments: []
    });
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enregistrer une absence</CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour documenter l'absence d'un employé
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">ID Employé</Label>
              <Input 
                id="employeeId" 
                value={formData.employeeId} 
                onChange={e => setFormData({...formData, employeeId: e.target.value})} 
                placeholder="Ex: EMP001" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeName">Nom de l'employé</Label>
              <Input 
                id="employeeName" 
                value={formData.employeeName} 
                onChange={e => setFormData({...formData, employeeName: e.target.value})} 
                placeholder="Ex: Jean Dupont" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData({...formData, startDate: date})}
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
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData({...formData, endDate: date})}
                    initialFocus
                    disabled={(date) => date < formData.startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motif d'absence</Label>
            <Select 
              onValueChange={(value) => setFormData({...formData, reason: value})}
              value={formData.reason}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un motif" />
              </SelectTrigger>
              <SelectContent>
                {absenceReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Détails supplémentaires</Label>
            <Textarea 
              id="details" 
              value={formData.details} 
              onChange={e => setFormData({...formData, details: e.target.value})}
              placeholder="Ajoutez des informations complémentaires sur l'absence..." 
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Pièces justificatives</Label>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG ou PNG (MAX. 5MB)
                    </p>
                  </div>
                  <input 
                    id="attachments" 
                    type="file" 
                    className="hidden" 
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-sm">Fichiers sélectionnés:</p>
                  <ul className="space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                        <span className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                        >
                          Supprimer
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit">
            Enregistrer l'absence
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AbsenceRecordForm;
