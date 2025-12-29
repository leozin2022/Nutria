
import React from 'react';

const messages = [
  "Identificando ingredientes...",
  "Analisando porções...",
  "Consultando tabelas nutricionais...",
  "Calculando macronutrientes...",
  "Finalizando seu relatório elegante..."
];

const AnalysisLoader: React.FC = () => {
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-serif italic text-lg animate-pulse">
        {messages[msgIndex]}
      </p>
    </div>
  );
};

export default AnalysisLoader;
