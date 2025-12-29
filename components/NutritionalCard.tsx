
import React from 'react';
import { AnalysisResult } from '../types';

interface NutritionalCardProps {
  result: AnalysisResult;
}

const NutritionalCard: React.FC<NutritionalCardProps> = ({ result }) => {
  const { data, imageUrl } = result;

  // Calculando distribuição para o gráfico
  const totalMacros = data.protein + data.carbs + data.fat;
  const pProt = (data.protein / totalMacros) * 100 || 0;
  const pCarb = (data.carbs / totalMacros) * 100 || 0;
  const pFat = (data.fat / totalMacros) * 100 || 0;

  return (
    <div 
      id="shareable-card"
      className="bg-white max-w-[450px] w-full mx-auto shadow-2xl rounded-sm overflow-hidden border border-gray-100 flex flex-col aspect-[4/5] relative"
    >
      {/* Photo Section */}
      <div className="h-1/2 w-full relative overflow-hidden bg-gray-50">
        <img 
          src={imageUrl} 
          alt="Refeição" 
          className="w-full h-full object-cover grayscale-[10%] brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-6 text-white">
          <h2 className="font-serif text-2xl tracking-wide uppercase">Relatório Nutricional</h2>
          <p className="text-[10px] tracking-[0.4em] opacity-80 font-medium">BIANCA FERREIRA • NUTRICIONISTA</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-[#fdfcfb]">
        
        {/* Calorias e Score */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Estimativa Total</p>
            <p className="font-serif text-3xl font-light text-gray-800">{data.calories}<span className="text-xs ml-1 italic font-normal">kcal</span></p>
          </div>
          <div className="flex flex-col items-center">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base shadow-sm
                    ${data.nutritionalScore === 'A' ? 'bg-emerald-500' : 
                      data.nutritionalScore === 'B' ? 'bg-green-400' : 
                      data.nutritionalScore === 'C' ? 'bg-amber-400' : 
                      data.nutritionalScore === 'D' ? 'bg-orange-500' : 'bg-rose-500'}
                `}>
                    {data.nutritionalScore}
                </span>
                <p className="text-[8px] mt-1 text-gray-400 tracking-widest uppercase font-bold">Grade</p>
          </div>
        </div>

        {/* Gráficos Visuais de Macronutrientes */}
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Proteína */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Proteínas</p>
                <p className="text-xs font-serif italic text-emerald-800">{data.protein}g</p>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(pProt * 2, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbos */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Carbos</p>
                <p className="text-xs font-serif italic text-amber-800">{data.carbs}g</p>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(pCarb, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Gorduras */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Gorduras</p>
                <p className="text-xs font-serif italic text-rose-800">{data.fat}g</p>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(pFat * 3, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-2 pt-4 border-t border-gray-100">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Feedback da Nutri</p>
            <div className="relative pl-4 border-l-2 border-emerald-100">
              <p className="text-sm font-serif italic text-gray-600 leading-relaxed">
                "{data.description}"
              </p>
              <div className="absolute top-0 -left-1 text-emerald-600 opacity-20 text-4xl font-serif">“</div>
            </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-50">
          <div className="flex flex-col">
            <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase font-bold">Gerado via NutriVision</p>
            <p className="text-[10px] text-emerald-800 italic font-serif">biancaferreira.com.br</p>
          </div>
          <div className="opacity-40 grayscale h-8">
            {/* Logotipo ou símbolo elegante opcional */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-900">
              <path d="M12 2L15 8H21L16.5 12L18 18L12 14.5L6 18L7.5 12L3 8H9L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionalCard;
