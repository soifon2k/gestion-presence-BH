
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientForm from './ClientForm';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ClientData {
  id?: number;
  name: string;
  service: string;
  details: string;
  email: string;
  phone: string;
  dateArrivee: string;
  dateDepart: string;
  qrCode: string;
  status: string;
}

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientData;
  onSave: (client: ClientData) => Promise<void>;
}

export default function ClientModal({ isOpen, onClose, client, onSave }: ClientModalProps) {
  const isEdit = !!client;
  const isMobile = useIsMobile();

  const handleSubmit = async (values: ClientData) => {
    // Si c'est un nouveau client, générer un code QR
    if (!isEdit) {
      const qrCode = `CL${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      values.qrCode = qrCode;
      values.status = "Réservé"; // Par défaut, un nouveau client est "Réservé"
    }
    
    // Fusionner avec les données existantes si on est en mode édition
    const updatedClient = isEdit 
      ? { ...client, ...values } 
      : values;
    
    await onSave(updatedClient);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw] p-4" : "sm:max-w-[600px]"}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le client" : "Ajouter un nouveau client"}</DialogTitle>
        </DialogHeader>
        
        <ClientForm 
          initialValues={client} 
          onSubmit={handleSubmit} 
          isEdit={isEdit} 
        />
      </DialogContent>
    </Dialog>
  );
}
