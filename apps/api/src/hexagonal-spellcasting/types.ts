import { HexElement, MoonPhase } from '@astra-arcana/spellcasting-types';

// Element relationship structure
export interface ElementRelationship {
  id: HexElement;
  baseValue: number;
  oppositeId: HexElement;
  neighbors: HexElement[];
}

// Processed ingredient
export interface ProcessedIngredient {
  elementId: HexElement;
  processedValue: number;
  name: string;
}

// Processed incantation
export interface ProcessedIncantation {
  elementId?: HexElement;
  spellTypeId: string;
  languageId: string;
  moonPhase?: MoonPhase;
  processedValue: number;
  power: number;
  duration: number;
  complexity: number;
  name: string;
}
