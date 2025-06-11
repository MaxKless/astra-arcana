export type Ingredient = {
  name: string;
  affinity: Element;
  age?: Age;
};

export type Age = 'ancient' | 'old' | 'fresh';

export type Incantation = {
  name: string;
  language: Language;
  affinity?: Element;
  kind: 'ritual' | 'spell' | 'support' | 'sacrifice' | 'other';
  moonphase?: MoonPhase;
};

export type Recipe = {
  name: string;
  origin: string;
  ingredients: Ingredient[];
  incantations: Incantation[];
};

export type Language =
  | 'English'
  | 'Spanish'
  | 'Latin'
  | 'Old English'
  | 'Old Norse'
  | 'Sanskrit'
  | 'Other';
export type Element = 'fire' | 'water' | 'earth' | 'air' | 'aether' | 'void';
export type MoonPhase = 'new' | 'waxing' | 'full' | 'waning';

// Elemental relationship definitions for hexagonal visualization
export interface ElementRelationship {
  id: Element;
  baseValue: number;
  oppositeId: Element;
  neighbors: Element[];
}

// Core element definitions for the hexagonal system (from API implementation)
export const ELEMENTAL_RELATIONSHIPS: Record<string, ElementRelationship> = {
  FIRE: {
    id: 'fire',
    baseValue: 5,
    oppositeId: 'water',
    neighbors: ['air', 'earth'],
  },
  WATER: {
    id: 'water',
    baseValue: 5,
    oppositeId: 'fire',
    neighbors: ['earth', 'aether'],
  },
  EARTH: {
    id: 'earth',
    baseValue: 5,
    oppositeId: 'air',
    neighbors: ['fire', 'water'],
  },
  AIR: {
    id: 'air',
    baseValue: 5,
    oppositeId: 'earth',
    neighbors: ['fire', 'void'],
  },
  AETHER: {
    id: 'aether',
    baseValue: 5,
    oppositeId: 'void',
    neighbors: ['water', 'void'],
  },
  VOID: {
    id: 'void',
    baseValue: 5,
    oppositeId: 'aether',
    neighbors: ['air', 'aether'],
  },
};

// Hexagon positioning for visualization (coordinates for 400x400 SVG viewBox)
export interface ElementPosition {
  x: number;
  y: number;
  angle: number; // degrees for rotation/positioning
}

export const HEXAGON_ELEMENT_POSITIONS: Record<Element, ElementPosition> = {
  // Arranging so opposites are across from each other:
  // Fire (top) ↔ Water (bottom)
  fire: { x: 200, y: 50, angle: 0 }, // Top
  water: { x: 200, y: 350, angle: 180 }, // Bottom (opposite of fire)

  // Earth (top-right) ↔ Air (bottom-left)
  earth: { x: 350, y: 150, angle: 60 }, // Top-right
  air: { x: 50, y: 250, angle: 240 }, // Bottom-left (opposite of earth)

  // Aether (bottom-right) ↔ Void (top-left)
  aether: { x: 350, y: 250, angle: 120 }, // Bottom-right
  void: { x: 50, y: 150, angle: 300 }, // Top-left (opposite of aether)
};

// Element colors for visualization - more subdued and muted
export const ELEMENT_COLORS: Record<
  Element,
  { primary: string; glow: string }
> = {
  fire: { primary: '#cc4444', glow: '#dd6644' },
  water: { primary: '#4466cc', glow: '#4488dd' },
  earth: { primary: '#668844', glow: '#77aa44' },
  air: { primary: '#aaaaaa', glow: '#cccccc' },
  aether: { primary: '#8844cc', glow: '#aa66dd' },
  void: { primary: '#555555', glow: '#666688' },
};

// Helper function to get opposite element
export function getOppositeElement(element: Element): Element | null {
  const relationship = ELEMENTAL_RELATIONSHIPS[element.toUpperCase()];
  return relationship?.oppositeId || null;
}

// Helper function to get neighboring elements
export function getNeighborElements(element: Element): Element[] {
  const relationship = ELEMENTAL_RELATIONSHIPS[element.toUpperCase()];
  return relationship?.neighbors || [];
}

// Helper function to determine relationship type between two elements
export function getElementRelationshipType(
  element1: Element,
  element2: Element
): 'opposite' | 'neighbor' | 'neutral' {
  if (element1 === element2) return 'neutral';

  const relationship1 = ELEMENTAL_RELATIONSHIPS[element1.toUpperCase()];
  if (!relationship1) return 'neutral';

  if (relationship1.oppositeId === element2) {
    return 'opposite';
  }

  if (relationship1.neighbors.includes(element2)) {
    return 'neighbor';
  }

  return 'neutral';
}

// Types for hexagonal spellcasting visualization
export type ElementInteraction = {
  element1: Element;
  element2: Element;
  relationshipType: 'opposite' | 'neighbor' | 'neutral';
  modifier: number;
  strength: number;
};

export type SpellVisualizationData = {
  elementalBalance: Record<Element, number>;
  interactions: ElementInteraction[];
  interactionModifier: number;
  successRate: number;
  power: number;
  duration: number;
  complexity: number;
  dominantElement?: Element;
};

// Complete spell result with effects
export interface CompleteSpellResult extends SpellResult {
  effects: ElementEffect[];
  specialEffect: SpecialEffect | null;
  effectStrength: number;
  durationDescription: string;
  successDescription: string;
  spellDescription: string;
}

// Basic spell result structure
export interface SpellResult {
  success: boolean;
  successRate: number;
  power: number;
  duration: number;
  dominantElement?: HexElement;
  elementalBalance: Record<HexElement, number>;
  interactionModifier: number;
  ingredients: string[];
  incantations: string[];
}

// Special effect structure
export interface SpecialEffect {
  name: string;
  description: string;
  elements?: string;
  element?: HexElement;
}

// Element effect
export interface ElementEffect {
  element: HexElement;
  effect: string;
  strength: 'strong' | 'moderate' | 'subtle';
  proportion: number;
}

// Extended element type to include our hexagonal system
export type HexElement = 'fire' | 'water' | 'earth' | 'air' | 'aether' | 'void';
