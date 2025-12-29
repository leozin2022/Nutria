
import React, { useRef, useEffect, useState } from 'react';

interface CameraInterfaceProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<{title: string, message: string} | null>(null);
  const [isFocusing, setIsFocusing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError({
          title: "Navegador não suportado",
          message: "Seu navegador não possui suporte para acesso à câmera."
        });
        return;
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        
        // @ts-ignore - focusMode is an experimental capability
        if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
          try {
            await track.applyConstraints({
              // @ts-ignore
              advanced: [{ focusMode: 'continuous' }]
            });
          } catch (e) {
            console.debug("Focus constraints application failed", e);
          }
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setIsFocusing(true);
        setTimeout(() => setIsFocusing(false), 2000);

      } catch (err: any) {
        console.error("Erro ao acessar a câmera:", err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError({
            title: "Permissão Negada",
            message: "O acesso à câmera foi bloqueado. Por favor, habilite as permissões nas configurações do seu navegador para continuar."
          });
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError({
            title: "Câmera não encontrada",
            message: "Não conseguimos detectar nenhuma câmera conectada ao seu dispositivo."
          });
        } else {
          setError({
            title: "Erro de Câmera",
            message: "Ocorreu um problema ao iniciar a câmera. Tente recarregar a página."
          });
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white text-xs uppercase tracking-widest p-2"
        >
          Fechar
        </button>
      </div>

      <div className="absolute top-6 right-6 z-10 text-right">
        <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">NutriVision</p>
      </div>

      {isFocusing && !error && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-emerald-400/50 rounded-lg animate-ping opacity-0"></div>
          <div className="absolute w-24 h-24 border border-emerald-400/30 rounded-lg animate-pulse"></div>
        </div>
      )}

      {error ? (
        <div className="text-white text-center p-8 space-y-6 max-w-sm">
          <div className="space-y-2">
            <h3 className="font-serif italic text-2xl text-emerald-400">{error.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{error.message}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-[10px] uppercase tracking-[0.2em] border border-white/20 px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Voltar para o Início
          </button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center space-y-8">
             <div className="text-center">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-4">
                  {isFocusing ? "Ajustando foco..." : "Enquadre o seu prato"}
                </p>
                <button 
                  onClick={takePhoto}
                  className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center group active:scale-90 transition-transform"
                >
                  <div className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-transform"></div>
                </button>
             </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraInterface;
