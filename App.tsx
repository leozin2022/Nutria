
import React, { useState, useRef } from 'react';
import { analyzePlate } from './services/geminiService';
import { AnalysisResult } from './types';
import AnalysisLoader from './components/AnalysisLoader';
import NutritionalCard from './components/NutritionalCard';
import CameraInterface from './components/CameraInterface';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (base64String: string) => {
    setImage(base64String);
    setResult(null);
    setError(null);
    
    const pureBase64 = base64String.split(',')[1];
    
    setIsAnalyzing(true);
    try {
      const data = await analyzePlate(pureBase64);
      setResult({
        imageUrl: base64String,
        data
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("Erro de configuração da API. Por favor, verifique se o modelo está disponível.");
      } else {
        setError("Ocorreu um erro ao analisar seu prato. Verifique a iluminação e tente novamente.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      processImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const handleShare = async () => {
    const cardElement = document.getElementById('shareable-card');
    if (!cardElement) return;

    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error("Falha ao gerar imagem");

      const file = new File([blob], 'nutrivision-biancaferreira.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Minha Análise Nutricional',
          text: 'Confira a análise do meu prato feita pela Nutri Bianca Ferreira com NutriVision!',
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'nutrivision-biancaferreira.png';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
      alert("Não foi possível compartilhar automaticamente. A imagem foi baixada.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] flex flex-col">
      <header className="p-8 text-center space-y-2 no-print">
        <h1 className="font-serif text-4xl font-light tracking-tight text-gray-800">
          NutriVision
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-medium">
          Bianca Ferreira
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-12 max-w-4xl mx-auto w-full">
        {!image && !isAnalyzing && !isCameraOpen && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Nutritionist Profile Section - Enhanced Aesthetic */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-emerald-50 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-[1px] border-emerald-100 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
                  alt="Nutricionista Bianca Ferreira" 
                  className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <h2 className="font-serif text-3xl italic text-gray-800 tracking-tight">Elegância na sua mesa.</h2>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                Olá, eu sou a <span className="text-emerald-800 font-medium">Bianca Ferreira</span>. <br/>
                Combinei nutrição de precisão com inteligência artificial para que você tenha um olhar clínico sobre cada refeição, de forma simples e sofisticada.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button 
                onClick={() => setIsCameraOpen(true)}
                className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Tirar Foto
              </button>
              
              <button 
                onClick={triggerUpload}
                className="flex-1 bg-white border border-gray-100 text-gray-600 px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </button>
            </div>

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
          </div>
        )}

        {isCameraOpen && (
          <CameraInterface 
            onCapture={processImage} 
            onClose={() => setIsCameraOpen(false)} 
          />
        )}

        {isAnalyzing && (
          <div className="flex-1 flex items-center justify-center">
            <AnalysisLoader />
          </div>
        )}

        {error && !isAnalyzing && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-lg text-center mt-12 space-y-4 max-w-sm">
            <p className="text-rose-600 text-sm font-medium">{error}</p>
            <button 
              onClick={triggerUpload}
              className="text-xs uppercase tracking-widest underline font-bold text-gray-800"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="w-full flex flex-col items-center space-y-12 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <NutritionalCard result={result} />
            
            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <button 
                onClick={reset}
                className="text-[10px] uppercase tracking-widest py-3 px-8 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
              >
                Nova Análise
              </button>
              
              <button 
                disabled={isSharing}
                onClick={handleShare}
                className={`text-[10px] uppercase tracking-widest py-3 px-8 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-2 ${isSharing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSharing ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
                {isSharing ? 'Preparando...' : 'Compartilhar'}
              </button>

              <button 
                onClick={() => window.print()} 
                className="text-[10px] uppercase tracking-widest py-3 px-8 rounded-full bg-white border border-gray-900 text-gray-900 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
              >
                Imprimir / PDF
              </button>
            </div>
            
            <div className="max-w-md text-center no-print">
              <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-widest opacity-60">
                * Estimativas baseadas no modelo Gemini Flash. Use como referência educacional e consulte sempre sua nutricionista para planos personalizados.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-[10px] text-gray-300 tracking-[0.2em] uppercase no-print">
        &copy; {new Date().getFullYear()} Nutri Bianca Ferreira • Minimalist Wellness
      </footer>
    </div>
  );
};

export default App;
