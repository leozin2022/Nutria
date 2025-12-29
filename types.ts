
export interface NutritionalInfo {
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  nutritionalScore: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface AnalysisResult {
  imageUrl: string;
  data: NutritionalInfo;
}
