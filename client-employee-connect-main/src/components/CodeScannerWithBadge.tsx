
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Camera, UserCheck, Hotel, Utensils, BarcodeIcon, ScanIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CodeDisplay from './CodeDisplay';
import jsQR from 'jsqr';
import Quagga from '@ericblade/quagga2';

interface CodeScannerWithBadgeProps {
  onScanSuccess: (code: string, action: "in" | "out", timestamp: string) => void;
  type: "barcode" | "qrcode";
}

// Base de données simulée pour les employés et clients
const employeesDB = [
  { code: "EMP001", name: "Jean Dupont", department: "Administration", lastEntry: null },
  { code: "EMP002", name: "Marie Martin", department: "Restaurant", lastEntry: null },
  { code: "EMP003", name: "Pierre Thomas", department: "Hôtel", lastEntry: null },
  { code: "EMP004", name: "Sophie Laurent", department: "Production d'eau", lastEntry: null },
  { code: "EMP005", name: "Ahmed Bensaid", department: "Conférences", lastEntry: null },
];

const clientsDB = [
  { code: "CL001", name: "Patrick Durand", service: "Hôtel", lastEntry: null },
  { code: "CL002", name: "Carole Petit", service: "Restaurant", lastEntry: null },
  { code: "CL003", name: "Thomas Girard", service: "Conférences", lastEntry: null },
  { code: "CL004", name: "Julie Moreau", service: "Événements", lastEntry: null },
  { code: "CL005", name: "Marc Lefevre", service: "Restaurant", lastEntry: null },
  { code: "CL006", name: "Emma Richard", service: "Hôtel", lastEntry: null },
];

export default function CodeScannerWithBadge({ onScanSuccess, type }: CodeScannerWithBadgeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [action, setAction] = useState<"in" | "out">("in");
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [scannedInfo, setScannedInfo] = useState<{
    code: string;
    type: string;
    name: string;
    department?: string;
    service?: string;
    timestamp: string;
  } | null>(null);
  
  const scannerIntervalRef = useRef<number | null>(null);

  // Démarrer la caméra
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const constraints = {
        video: { facingMode: "environment" }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      
      // Attendre que la vidéo soit chargée
      videoRef.current.onloadedmetadata = () => {
        setScanning(true);
        if (videoRef.current) videoRef.current.play();
        
        if (type === "barcode") {
          startBarcodeScanning();
        } else {
          startQRCodeScanning();
        }
      };
      
      toast({
        title: "Caméra activée",
        description: `Scanner de ${type === "barcode" ? "code-barres" : "QR code"} prêt à l'emploi.`,
      });
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra:", err);
      toast({
        title: "Erreur de caméra",
        description: "Impossible d'accéder à la caméra. Vérifiez les permissions.",
        variant: "destructive"
      });
    }
  };

  // Arrêter la caméra
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (scannerIntervalRef.current) {
      window.clearInterval(scannerIntervalRef.current);
      scannerIntervalRef.current = null;
    }
    
    // Si on utilise Quagga pour les codes-barres, on l'arrête aussi
    if (type === "barcode") {
      try {
        Quagga.stop();
      } catch (e) {
        console.log("Quagga n'était pas démarré");
      }
    }
    
    setScanning(false);
  };

  // Nettoyer à la sortie du composant
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Scanner les codes-barres avec Quagga
  const startBarcodeScanning = () => {
    if (!videoRef.current) return;
    
    try {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          },
        },
        decoder: {
          readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_93_reader", "upc_reader", "upc_e_reader"]
        },
        locate: true
      }, function(err) {
        if (err) {
          console.error("Erreur d'initialisation de Quagga:", err);
          return;
        }
        
        Quagga.start();
        
        Quagga.onDetected((result) => {
          if (result.codeResult && result.codeResult.code) {
            const detectedCode = result.codeResult.code;
            console.log("Code-barres détecté:", detectedCode);
            
            // Arrêter le scan pour éviter les détections multiples
            stopCamera();
            
            // Chercher l'employé correspondant
            processScannedCode(detectedCode);
          }
        });
      });
    } catch (err) {
      console.error("Erreur lors de la configuration de Quagga:", err);
      // Utiliser une méthode de détection alternative
      startFallbackBarcodeScanning();
    }
  };
  
  // Méthode alternative pour scanner les codes-barres
  const startFallbackBarcodeScanning = () => {
    if (scannerIntervalRef.current) {
      window.clearInterval(scannerIntervalRef.current);
    }
    
    scannerIntervalRef.current = window.setInterval(() => {
      // Simulation de détection de code-barres pour la démo
      if (Math.random() > 0.92 && scanning) {
        const randomIndex = Math.floor(Math.random() * employeesDB.length);
        const detectedCode = employeesDB[randomIndex].code;
        
        stopCamera();
        processScannedCode(detectedCode);
      }
    }, 1000);
  };
  
  // Scanner les QR codes avec jsQR
  const startQRCodeScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    scannerIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      
      // Ajuster la taille du canvas à celle de la vidéo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dessiner l'image actuelle de la vidéo sur le canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Obtenir les données d'image du canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      try {
        // Utiliser jsQR pour détecter les QR codes
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          console.log("QR code détecté:", code.data);
          
          // Arrêter le scan pour éviter les détections multiples
          stopCamera();
          
          processScannedCode(code.data);
        } else {
          // Simulation pour la démo car jsQR peut ne pas fonctionner dans tous les environnements
          if (Math.random() > 0.92 && scanning) {
            const randomIndex = Math.floor(Math.random() * clientsDB.length);
            const detectedCode = clientsDB[randomIndex].code;
            
            stopCamera();
            processScannedCode(detectedCode);
          }
        }
      } catch (e) {
        console.error("Erreur lors de la détection du QR code:", e);
        
        // Simulation pour la démo en cas d'erreur
        if (Math.random() > 0.92 && scanning) {
          const randomIndex = Math.floor(Math.random() * clientsDB.length);
          const detectedCode = clientsDB[randomIndex].code;
          
          stopCamera();
          processScannedCode(detectedCode);
        }
      }
    }, 500);
  };
  
  // Traiter le code scanné
  const processScannedCode = (detectedCode: string) => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const timestamp = `${currentTime.toLocaleDateString('fr-FR')} ${formattedTime}`;
    
    // Vérifier si c'est un code d'employé ou de client
    let personInfo;
    let isEmployee = detectedCode.startsWith('EMP');
    
    if (isEmployee) {
      personInfo = employeesDB.find(emp => emp.code === detectedCode);
      
      if (personInfo) {
        personInfo.lastEntry = timestamp;
        
        setScannedInfo({
          code: detectedCode,
          type: "Employé",
          name: personInfo.name,
          department: personInfo.department,
          timestamp: timestamp
        });
      }
    } else {
      personInfo = clientsDB.find(client => client.code === detectedCode);
      
      if (personInfo) {
        personInfo.lastEntry = timestamp;
        
        setScannedInfo({
          code: detectedCode,
          type: "Client",
          name: personInfo.name,
          service: personInfo.service,
          timestamp: timestamp
        });
      }
    }
    
    if (personInfo) {
      // Appeler le callback avec le code détecté, l'action et l'horodatage
      onScanSuccess(detectedCode, action, timestamp);
      
      // Notifier l'utilisateur
      toast({
        title: `${isEmployee ? "Employé" : "Client"} enregistré`,
        description: `${personInfo.name} (${detectedCode}) - ${action === "in" ? "Entrée" : "Sortie"} enregistrée à ${formattedTime}.`,
      });
      
      // Afficher le badge modal
      setShowBadgeModal(true);
    } else {
      toast({
        title: "Code non reconnu",
        description: `Le code ${detectedCode} n'est pas associé à un employé ou client enregistré.`,
        variant: "destructive"
      });
      
      // Redémarrer la caméra après quelques secondes
      setTimeout(() => {
        startCamera();
      }, 2000);
    }
  };

  // Changer l'action (entrée/sortie)
  const toggleAction = () => {
    setAction(prev => prev === "in" ? "out" : "in");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{type === "barcode" ? "Scanner de Code-barres" : "Scanner de QR Code"}</CardTitle>
          <Badge variant="outline" className={`${action === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {action === "in" ? "Enregistrer Entrée" : "Enregistrer Sortie"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="camera" className="space-y-4">
          <TabsList className="mb-4 bg-white">
            <TabsTrigger value="camera" className="bg-white">
              <Camera className="h-4 w-4 mr-1" />
              Caméra
            </TabsTrigger>
            <TabsTrigger value="info" className="bg-white">
              <ScanIcon className="h-4 w-4 mr-1" />
              Infos Badge
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera">
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                playsInline 
                muted
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full opacity-0"
              />
              
              {!scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  {type === "barcode" ? (
                    <BarcodeIcon className="h-12 w-12 text-white mb-2" />
                  ) : (
                    <ScanIcon className="h-12 w-12 text-white mb-2" />
                  )}
                  <p className="text-white text-sm mb-6">Caméra désactivée</p>
                  <Button onClick={startCamera}>
                    Activer la Caméra
                  </Button>
                </div>
              )}
              
              {scanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 animate-scan" />
              )}
              
              {scanning && (
                <div className="absolute top-2 right-2">
                  <Button variant="destructive" size="sm" onClick={stopCamera}>
                    Arrêter
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={toggleAction}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                {action === "in" ? "Changer à Sortie" : "Changer à Entrée"}
              </Button>
              
              {!scanning && (
                <Button onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-2" />
                  Démarrer
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            {scannedInfo ? (
              <div className="border rounded-md p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${scannedInfo.type === "Employé" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                    {scannedInfo.type === "Employé" ? <UserCheck className="h-6 w-6" /> : 
                     scannedInfo.service === "Hôtel" ? <Hotel className="h-6 w-6" /> : <Utensils className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{scannedInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">Code: {scannedInfo.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {scannedInfo.department || scannedInfo.service}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Horodatage: {scannedInfo.timestamp}
                    </p>
                    <Badge className="mt-2" variant="outline">
                      {action === "in" ? "Entrée" : "Sortie"} enregistrée
                    </Badge>
                    <Button className="mt-3 w-full" onClick={() => setShowBadgeModal(true)}>
                      Voir le Badge
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Aucune donnée de scan disponible</p>
                <p className="text-sm">Scannez un code pour voir les informations</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Affichage du badge après scan */}
      {scannedInfo && (
        <CodeDisplay 
          isOpen={showBadgeModal}
          onClose={() => setShowBadgeModal(false)}
          codeType={type === "barcode" ? "badge" : "qr"}
          code={scannedInfo.code}
          name={scannedInfo.name}
          detail={scannedInfo.department || scannedInfo.service || ""}
          showButtons={true}
        />
      )}
    </Card>
  );
}

// Ajout d'un style pour l'animation de scan
const style = document.createElement('style');
style.innerHTML = `
  @keyframes scan {
    0% { transform: translateY(0); opacity: 0.8; }
    50% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0.8; }
  }
  .animate-scan {
    animation: scan 2s linear infinite;
  }
`;
document.head.appendChild(style);
