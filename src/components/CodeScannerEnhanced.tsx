
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Camera, UserCheck, Hotel, Utensils } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeScannerProps {
  onScanSuccess: (code: string, action: "in" | "out") => void;
  type: "barcode" | "qrcode";
}

export default function CodeScannerEnhanced({ onScanSuccess, type }: CodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [action, setAction] = useState<"in" | "out">("in");
  const [lastScannedInfo, setLastScannedInfo] = useState<{
    code: string;
    type: string;
    name: string;
    department?: string;
    service?: string;
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
        startScanning();
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
    
    setScanning(false);
  };

  // Nettoyer à la sortie du composant
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Démarrer le processus de scan
  const startScanning = () => {
    if (scannerIntervalRef.current) {
      window.clearInterval(scannerIntervalRef.current);
    }
    
    // Analyser la vidéo toutes les 500ms
    scannerIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Ajuster la taille du canvas à celle de la vidéo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dessiner l'image actuelle de la vidéo sur le canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simuler la détection de code (dans une vraie implémentation, on utiliserait une bibliothèque comme ZXing)
      simulateCodeDetection();
    }, 500);
  };
  
  // Dans un cas réel, on utiliserait une bibliothèque de détection
  // Simulation pour la démonstration
  const simulateCodeDetection = () => {
    // Les codes sont générés aléatoirement pour la démonstration
    const simulateDetection = Math.random() > 0.9; // 10% de chance de détecter quelque chose
    
    if (simulateDetection && scanning) {
      // Générer un code basé sur le type de scanner
      const isEmployee = type === "barcode";
      const codePrefix = isEmployee ? "EMP" : "CL";
      const codeNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
      const detectedCode = `${codePrefix}${codeNum}`;
      
      // Chercher des infos correspondantes dans nos données simulées
      const info = {
        code: detectedCode,
        type: isEmployee ? "Employé" : "Client",
        name: isEmployee 
          ? ["Jean Dupont", "Marie Martin", "Ahmed Bensaid", "Sophie Laurent"][Math.floor(Math.random() * 4)] 
          : ["Patrick Durand", "Carole Petit", "Julie Moreau", "Thomas Girard"][Math.floor(Math.random() * 4)],
        department: isEmployee ? ["Administration", "Restaurant", "Hôtel"][Math.floor(Math.random() * 3)] : undefined,
        service: !isEmployee ? ["Restaurant", "Hôtel", "Salle de conférence"][Math.floor(Math.random() * 3)] : undefined
      };
      
      // Mettre à jour les informations du scan
      setLastScannedInfo(info);
      
      // Appeler le callback avec le code détecté et l'action
      onScanSuccess(detectedCode, action);
      
      // Notifier l'utilisateur
      toast({
        title: `${info.type} détecté`,
        description: `${info.name} (${detectedCode}) a été enregistré avec succès.`,
      });
      
      // Arrêter le scan pendant quelques secondes pour éviter les détections multiples
      stopCamera();
      setTimeout(() => {
        if (videoRef.current) startCamera();
      }, 3000);
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
        <Tabs defaultValue="camera">
          <TabsList className="mb-4">
            <TabsTrigger value="camera">Caméra</TabsTrigger>
            <TabsTrigger value="info">Infos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="space-y-4">
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
                  <Camera className="h-12 w-12 text-white mb-2" />
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
            
            <div className="flex justify-between">
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
          
          <TabsContent value="info" className="space-y-4">
            {lastScannedInfo ? (
              <div className="border rounded-md p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${lastScannedInfo.type === "Employé" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                    {lastScannedInfo.type === "Employé" ? <UserCheck className="h-6 w-6" /> : 
                     lastScannedInfo.service === "Hôtel" ? <Hotel className="h-6 w-6" /> : <Utensils className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{lastScannedInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">Code: {lastScannedInfo.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {lastScannedInfo.department || lastScannedInfo.service}
                    </p>
                    <Badge className="mt-2" variant="outline">
                      {action === "in" ? "Entrée" : "Sortie"} enregistrée
                    </Badge>
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
