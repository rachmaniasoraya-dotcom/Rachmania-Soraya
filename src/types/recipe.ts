export interface DetectedIngredient {
  name: string;
  category: string;
  estimatedQuantityOrCondition: string;
  storageAdvice: string;
}

export interface StorageTip {
  title: string;
  description: string;
}

export interface NutritionFact {
  ingredient: string;
  highlightNutrient: string;
  healthBenefit: string;
}

export interface EducationGuide {
  themeTitle: string;
  introSummary: string;
  storageTips: StorageTip[];
  nutritionFacts: NutritionFact[];
  antiFoodWasteTip: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  proTip?: string;
}

export interface RecipeItem {
  menuName: string;
  tagline: string;
  cookingTime: string;
  difficulty: string;
  servings: string;
  mainIngredients: string[];
  pantryIngredients: string[];
  steps: RecipeStep[];
  chefNote: string;
}

export interface ModuleCover {
  title: string;
  subtitle: string;
  coverIllustrationDescription: string;
  editionBadge: string;
  dateGenerated: string;
}

export interface RecipeGuideModule {
  cover: ModuleCover;
  detectedIngredients: DetectedIngredient[];
  educationGuide: EducationGuide;
  recipes: RecipeItem[];
}
