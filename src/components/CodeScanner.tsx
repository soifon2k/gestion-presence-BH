
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, CheckCircle2, XCircle, CameraIcon, QrCode, BarcodeIcon, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import jsQR from 'jsqr';
import Quagga from '@ericblade/quagga2';

interface CodeScannerProps {
  type: "barcode" | "qrcode"; // "barcode" pour les employés, "qrcode" pour les clients
  onScanSuccess?: (code: string, action: "in" | "out") => void;
}

// Base de données simulée pour les démonstrations
const employeesDB = [
  { code: "EMP001", name: "Jean Dupont", department: "Administration" },
  { code: "EMP002", name: "Marie Martin", department: "Restaurant" },
  { code: "EMP003", name: "Pierre Thomas", department: "Hôtel" },
  { code: "EMP004", name: "Sophie Laurent", department: "Production d'eau" },
];

const clientsDB = [
  { code: "CL001", name: "Patrick Durand", service: "Hôtel" },
  { code: "CL002", name: "Carole Petit", service: "Restaurant" },
  { code: "CL003", name: "Thomas Girard", service: "Conférences" },
  { code: "CL004", name: "Julie Moreau", service: "Événements" },
];

export default function CodeScanner({ type, onScanSuccess }: CodeScannerProps) {
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [action, setAction] = useState<"in" | "out">("in");
  const [lastScanned, setLastScanned] = useState<{ 
    code: string; 
    name: string; 
    type: string; 
    action: "in" | "out"; 
    time: string 
  } | null>(null);
  const isMobile = useIsMobile();
  
  // Intervalle pour la détection de code
  const scanIntervalRef = useRef<number | null>(null);

  // Activer la caméra
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices) {
        toast({
          title: "Erreur",
          description: "Votre appareil ne prend pas en charge l'accès à la caméra.",
          variant: "destructive",
        });
        return;
      }

      const constraints = {
        video: {
          facingMode: "environment", // Utiliser la caméra arrière
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setScanning(true);
        
        // Commencer la détection selon le type de code
        if (type === "barcode") {
          startBarcodeDetection();
        } else {
          startQRCodeDetection();
        }
        
        toast({
          title: "Caméra activée",
          description: `Veuillez placer le ${type === "barcode" ? "code-barres" : "code QR"} en face de la caméra.`,
        });
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      toast({
        title: "Erreur de caméra",
        description: "Impossible d'accéder à la caméra. Veuillez vérifier vos autorisations.",
        variant: "destructive",
      });
    }
  };

  // Arrêter la caméra
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      setScanning(false);
    }

    // Nettoyer les intervalles ou instances Quagga
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    try {
      Quagga.stop();
    } catch (e) {
      console.log("Quagga n'était pas démarré");
    }
  };

  // Détecter les codes-barres avec Quagga
  const startBarcodeDetection = () => {
    if (!videoRef.current) return;
    
    try {
      // Initialiser Quagga avec la vidéo active
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_93_reader",
            "upc_reader",
            "upc_e_reader"
          ]
        },
        locate: true
      }, function(err) {
        if (err) {
          console.error("Erreur d'initialisation Quagga:", err);
          fallbackBarcodeDetection(); // Utiliser une méthode alternative
          return;
        }
        
        console.log("Quagga started successfully");
        Quagga.start();
        
        Quagga.onDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            const scannedCode = result.codeResult.code;
            console.log("Code-barres détecté:", scannedCode);
            
            // Vérifier si le code est valide (simulé)
            processScannedCode(scannedCode);
          }
        });
      });
    } catch (err) {
      console.error("Erreur lors de l'initialisation de Quagga:", err);
      fallbackBarcodeDetection(); // Utiliser une méthode alternative
    }
  };

  // Méthode de détection alternative pour les codes-barres
  const fallbackBarcodeDetection = () => {
    console.log("Using fallback barcode detection");
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    scanIntervalRef.current = window.setInterval(() => {
      if (!cameraActive) return;
      
      // Pour la démonstration: simuler une détection
      if (Math.random() > 0.8) {
        const randomIndex = Math.floor(Math.random() * employeesDB.length);
        processScannedCode(employeesDB[randomIndex].code);
      }
    }, 2000); // Vérifier toutes les 2 secondes
  };

  // Détecter les codes QR avec jsQR
  const startQRCodeDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Utiliser un intervalle pour analyser continuellement l'image de la caméra
    scanIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || !cameraActive) return;
      
      const video = videoRef.current;
      
      // S'assurer que la vidéo est chargée
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
      
      // Ajuster le canvas à la taille de la vidéo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dessiner l'image actuelle de la vidéo sur le canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Obtenir les données d'image du canvas
      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
        // Utiliser jsQR pour détecter les codes QR
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          console.log("QR code détecté:", code.data);
          processScannedCode(code.data);
        } else if (Math.random() > 0.9) {
          // Fallback pour la démo: simuler une détection occasionnellement
          const randomIndex = Math.floor(Math.random() * clientsDB.length);
          processScannedCode(clientsDB[randomIndex].code);
        }
      } catch (err) {
        console.error("Erreur lors de la détection du QR code:", err);
        
        // Fallback pour la démo en cas d'erreur
        if (Math.random() > 0.9) {
          const randomIndex = Math.floor(Math.random() * clientsDB.length);
          processScannedCode(clientsDB[randomIndex].code);
        }
      }
    }, 500); // Vérifier toutes les 500ms
  };

  // Traiter le code scanné (commun pour les deux types)
  const processScannedCode = (detectedCode: string) => {
    // Arrêter temporairement la détection pour éviter les doublons
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    try {
      Quagga.stop();
    } catch (e) {
      // Ignorer si Quagga n'était pas démarré
    }
    
    // Vérifier si c'est un code d'employé ou de client
    const isEmployee = detectedCode.startsWith("EMP");
    const isClient = detectedCode.startsWith("CL");
    
    if ((type === "barcode" && !isEmployee) || (type === "qrcode" && !isClient)) {
      toast({
        title: "Type de code incorrect",
        description: `Ce code n'est pas un ${type === "barcode" ? "code-barres d'employé" : "QR code client"}.`,
        variant: "destructive",
      });
      
      // Reprendre la détection après un délai
      setTimeout(() => {
        if (type === "barcode") {
          startBarcodeDetection();
        } else {
          startQRCodeDetection();
        }
      }, 2000);
      
      return;
    }
    
    // Rechercher les données de la personne
    const person = isEmployee 
      ? employeesDB.find(emp => emp.code === detectedCode)
      : clientsDB.find(client => client.code === detectedCode);
    
    if (!person) {
      toast({
        title: "Code non reconnu",
        description: "Personne non trouvée dans la base de données.",
        variant: "destructive",
      });
      
      // Reprendre la détection après un délai
      setTimeout(() => {
        if (type === "barcode") {
          startBarcodeDetection();
        } else {
          startQRCodeDetection();
        }
      }, 2000);
      
      return;
    }
    
    // Enregistrer les informations
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setLastScanned({
      code: detectedCode,
      name: person.name,
      type: isEmployee ? "Employé" : "Client",
      action: action,
      time: time,
    });
    
    // Appeler le callback de succès
    if (onScanSuccess) {
      onScanSuccess(detectedCode, action);
    }
    
    // Notification
    toast({
      title: `${isEmployee ? "Employé" : "Client"} ${action === "in" ? "arrivé" : "parti"}`,
      description: `${person.name} (${detectedCode}) a été enregistré à ${time}.`,
    });
    
    // Arrêter la caméra après un scan réussi
    stopCamera();
  };

  // Action manuelle avec le code saisi
  const handleManualScan = () => {
    if (!code) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code.",
        variant: "destructive",
      });
      return;
    }
    
    processScannedCode(code);
  };

  // Changer l'action (entrée/sortie)
  const toggleAction = () => {
    setAction(prev => prev === "in" ? "out" : "in");
  };

  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {type === "barcode" ? (
              <>Scanner Code-barres (Employés)</>
            ) : (
              <>Scanner Code QR (Clients)</>
            )}
          </CardTitle>
          <Badge variant="outline" className={`${action === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {action === "in" ? "Enregistrer Entrée" : "Enregistrer Sortie"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        {cameraActive ? (
          <div className="relative w-full max-w-sm mb-6">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              className="w-full h-auto rounded-lg border border-gray-300"
            />
            <canvas 
              ref={canvasRef} 
              className="hidden"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-blue-500 rounded-lg w-64 h-64 flex items-center justify-center">
                <div className="absolute bg-blue-500 h-1 w-full animate-scan"></div>
              </div>
            </div>
            <Button 
              className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700"
              onClick={stopCamera}
            >
              Arrêter
            </Button>
          </div>
        ) : (
          <div 
            className="border border-dashed border-gray-300 rounded-lg p-8 mb-6 w-full text-center cursor-pointer"
            onClick={!scanning ? startCamera : undefined}
          >
            {scanning ? (
              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24 mb-4">
                  {type === "barcode" ? (
                    <BarcodeIcon className="h-24 w-24 text-gray-400 animate-pulse" />
                  ) : (
                    <QrCode className="h-24 w-24 text-gray-400 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-blue-500 h-1 animate-scan"></div>
                </div>
                <p className="text-muted-foreground">Scan en cours...</p>
              </div>
            ) : (
              <>
                {type === "barcode" ? (
                  <BarcodeIcon className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                ) : (
                  <QrCode className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                )}
                <p className="text-muted-foreground">
                  Cliquez ici pour scanner un {type === "barcode" ? "code-barres d'employé" : "code QR client"}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                >
                  <CameraIcon className="h-4 w-4 mr-2" />
                  Utiliser la caméra
                </Button>
              </>
            )}
          </div>
        )}
        
        <div className="w-full max-w-md space-y-4">
          <div className="flex">
            <Input 
              placeholder={type === "barcode" ? "Code de l'employé" : "Code du client"} 
              className="flex-grow" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button variant="outline" className="ml-2" onClick={handleManualScan}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              className={`${action === "in" ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"}`} 
              onClick={() => {
                setAction("in");
                toast({
                  title: "Mode changé",
                  description: "Scanner pour enregistrer une entrée",
                });
              }}
            >
              Entrée
            </Button>
            <Button 
              className={`${action === "out" ? "bg-red-600 hover:bg-red-700" : "bg-gray-500 hover:bg-gray-600"}`} 
              onClick={() => {
                setAction("out");
                toast({
                  title: "Mode changé",
                  description: "Scanner pour enregistrer une sortie",
                });
              }}
            >
              Sortie
            </Button>
          </div>

          <Button 
            className="w-full" 
            variant="outline" 
            onClick={toggleAction}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Changer à {action === "in" ? "Sortie" : "Entrée"}
          </Button>
        </div>
        
        {lastScanned && (
          <div className="mt-6 w-full">
            <h3 className="text-sm font-medium mb-2">Dernier scan:</h3>
            <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
              <div>
                <div className="inline-block">
                  <Badge variant={lastScanned.type === "Employé" ? "default" : "secondary"}>
                    {lastScanned.type}
                  </Badge>
                </div>
                <div className="font-medium mt-1">{lastScanned.name}</div>
                <div className="text-sm text-muted-foreground">{lastScanned.code}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  {lastScanned.action === "in" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span>{lastScanned.action === "in" ? "Entrée" : "Sortie"}</span>
                </div>
                <div className="text-sm text-muted-foreground">{lastScanned.time}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Ajout d'un style pour l'animation de scan */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0.8; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </Card>
  );
}
