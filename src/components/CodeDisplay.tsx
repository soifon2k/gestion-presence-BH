
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Printer, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { useIsMobile } from '@/hooks/use-mobile';

interface CodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  codeType: "badge" | "qr"; // "badge" pour les employés, "qr" pour les clients
  code: string;
  name: string;
  detail: string; // département pour employés ou service pour clients
  showButtons?: boolean;
}

export default function CodeDisplay({ 
  isOpen, 
  onClose, 
  codeType, 
  code, 
  name, 
  detail,
  showButtons = true 
}: CodeDisplayProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const isMobile = useIsMobile();
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Générer le code QR ou code-barres quand le composant est visible
  useEffect(() => {
    if (!isOpen) return;
    
    // Réinitialiser l'état
    setIsCodeGenerated(false);
    setDataUrl('');
    setError(null);
    
    // Attendre que le DOM soit prêt
    setTimeout(() => {
      try {
        // Ajouter des données supplémentaires pour enrichir les codes
        const payload = JSON.stringify({
          code,
          name,
          detail,
          type: codeType === 'badge' ? 'Employé' : 'Client',
          timestamp: new Date().toISOString(),
        });

        // Générer le code approprié
        if (codeType === 'qr' && qrRef.current) {
          QRCode.toCanvas(qrRef.current, payload, { 
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            }
          }, (error) => {
            if (error) {
              console.error('Erreur de génération du QR code:', error);
              setError("Impossible de générer le code QR");
              toast({
                title: "Erreur",
                description: "Impossible de générer le code QR",
                variant: "destructive"
              });
              return;
            }
            
            // Créer une URL de données pour le téléchargement/partage
            if (qrRef.current) {
              try {
                setDataUrl(qrRef.current.toDataURL('image/png'));
                setIsCodeGenerated(true);
                console.log("QR Code généré avec succès");
              } catch (e) {
                console.error("Erreur lors de la création du dataURL:", e);
                setError("Erreur lors de la création de l'image");
              }
            }
          });
        } else if (codeType === 'badge' && barcodeRef.current) {
          try {
            JsBarcode(barcodeRef.current, code, {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 80,
              displayValue: true,
              fontSize: 16,
              font: 'monospace',
              textMargin: 2,
              margin: 10
            });
            
            // Créer une URL de données pour le téléchargement/partage
            const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const img = new Image();
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                try {
                  const url = canvas.toDataURL('image/png');
                  setDataUrl(url);
                  setIsCodeGenerated(true);
                  console.log("Code-barres généré avec succès");
                } catch (e) {
                  console.error("Erreur lors de la création du dataURL:", e);
                  setError("Erreur lors de la création de l'image");
                }
              };
              img.onerror = (e) => {
                console.error("Erreur lors du chargement de l'image:", e);
                setError("Erreur lors du chargement de l'image");
              };
              const base64Data = btoa(unescape(encodeURIComponent(svgData)));
              img.src = 'data:image/svg+xml;base64,' + base64Data;
            } else {
              console.error("Impossible d'obtenir le contexte 2D du canvas");
              setError("Erreur technique lors de la génération");
            }
          } catch (err) {
            console.error('Erreur de génération du code-barres:', err);
            setError("Impossible de générer le code-barres");
            toast({
              title: "Erreur",
              description: "Impossible de générer le code-barres",
              variant: "destructive"
            });
          }
        }
      } catch (err) {
        console.error("Erreur générale lors de la génération du code:", err);
        setError("Erreur inattendue");
      }
    }, 100); // Petit délai pour s'assurer que le DOM est prêt
  }, [isOpen, code, name, detail, codeType]);

  // Imprimer le code
  const handlePrint = () => {
    if (!isCodeGenerated || !dataUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez attendre que le code soit généré",
        variant: "destructive"
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${codeType === 'badge' ? 'Badge' : 'Code QR'} - ${name}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              .container { margin: 20px; }
              .name { font-size: 24px; font-weight: bold; margin: 10px 0; }
              .detail { font-size: 16px; color: #777; margin-bottom: 20px; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="name">${name}</div>
              <div class="detail">${detail}</div>
              <img src="${dataUrl}" alt="Code">
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Imprimer après chargement de l'image
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
    
    toast({
      title: "Impression lancée",
      description: `Le ${codeType === "badge" ? "badge" : "code QR"} de ${name} est en cours d'impression.`,
    });
  };

  // Télécharger le code
  const handleDownload = () => {
    if (!isCodeGenerated || !dataUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez attendre que le code soit généré",
        variant: "destructive"
      });
      return;
    }
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${codeType === 'badge' ? 'badge' : 'qrcode'}_${name.replace(/\s+/g, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement",
      description: `Le ${codeType === "badge" ? "badge" : "code QR"} de ${name} a été téléchargé.`,
    });
  };

  // Partager le code (WhatsApp et autres)
  const handleShare = async () => {
    if (!isCodeGenerated || !dataUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez attendre que le code soit généré",
        variant: "destructive"
      });
      return;
    }

    // Sur mobile, utiliser l'API de partage native si disponible
    if (navigator.share && isMobile) {
      try {
        // Convertir dataUrl en blob pour le partage
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${codeType === 'badge' ? 'badge' : 'qrcode'}_${name}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `${codeType === 'badge' ? 'Badge' : 'Code QR'} de ${name}`,
          text: `Voici le ${codeType === 'badge' ? 'badge' : 'code QR'} de ${name}, ${detail}`,
          files: [file]
        });
        
        toast({
          title: "Partage réussi",
          description: "Le code a été partagé avec succès."
        });
      } catch (err) {
        console.error("Erreur lors du partage:", err);
        shareViaWhatsApp();
      }
    } else {
      // Fallback pour WhatsApp sur desktop ou si l'API de partage n'est pas disponible
      shareViaWhatsApp();
    }
  };
  
  // Fonction spécifique pour partager via WhatsApp
  const shareViaWhatsApp = () => {
    // Créer le lien WhatsApp
    const text = encodeURIComponent(`${codeType === 'badge' ? 'Badge' : 'Code QR'} de ${name}, ${detail}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    
    // Ouvrir dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Partage via WhatsApp",
      description: "Veuillez coller l'image dans la conversation WhatsApp après avoir copié le texte.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {codeType === "badge" ? "Badge Employé" : "Code QR Client"}
          </DialogTitle>
          <DialogDescription>
            Vous pouvez imprimer, télécharger ou partager ce code.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center p-3">
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription>
              <Badge variant="outline" className={codeType === "badge" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                {detail}
              </Badge>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex justify-center p-6 pb-8">
            {error ? (
              <div className="text-center text-red-500">
                <p>{error}</p>
                <p className="text-sm mt-2">Veuillez réessayer</p>
              </div>
            ) : codeType === "badge" ? (
              // Afficher un vrai code-barres pour les employés
              <div className="flex flex-col items-center">
                <svg ref={barcodeRef} className="w-64"></svg>
                {!isCodeGenerated && (
                  <p className="text-sm text-gray-500 mt-2">Génération du code-barres...</p>
                )}
              </div>
            ) : (
              // Afficher un vrai code QR pour les clients
              <div className="flex flex-col items-center">
                <canvas ref={qrRef} className="mb-3 border-8 border-white outline outline-1 outline-gray-300"></canvas>
                {!isCodeGenerated && (
                  <p className="text-sm text-gray-500 mt-2">Génération du code QR...</p>
                )}
              </div>
            )}
          </CardContent>
          
          {showButtons && (
            <CardFooter className="flex flex-wrap justify-center gap-2 p-3 pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint} 
                disabled={!isCodeGenerated || !!error}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload} 
                disabled={!isCodeGenerated || !!error}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare} 
                disabled={!isCodeGenerated || !!error}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </CardFooter>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
