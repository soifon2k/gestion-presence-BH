
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmployeeForm from './EmployeeForm';
import { useIsMobile } from '@/hooks/use-mobile';

export interface EmployeeData {
  id?: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  badgeNumber: string;
  status: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: EmployeeData;
  onSave: (employee: EmployeeData) => Promise<void>;
}

export default function EmployeeModal({ isOpen, onClose, employee, onSave }: EmployeeModalProps) {
  const isEdit = !!employee;
  const isMobile = useIsMobile();

  const handleSubmit = async (values: EmployeeData) => {
    // Si c'est un nouvel employé, générer un numéro de badge
    if (!isEdit) {
      const badgeNumber = `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      values.badgeNumber = badgeNumber;
      values.status = "Présent"; // Par défaut, un nouvel employé est "Présent"
    }
    
    // Fusionner avec les données existantes si on est en mode édition
    const updatedEmployee = isEdit 
      ? { ...employee, ...values } 
      : values;
    
    await onSave(updatedEmployee);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw] p-4" : "sm:max-w-[600px]"}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'employé" : "Ajouter un nouvel employé"}</DialogTitle>
        </DialogHeader>
        
        <EmployeeForm 
          initialValues={employee} 
          onSubmit={handleSubmit} 
          isEdit={isEdit} 
        />
      </DialogContent>
    </Dialog>
  );
}
