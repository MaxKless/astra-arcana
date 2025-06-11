import {
  Ingredient,
  Incantation,
  Recipe,
  Element,
  Age,
  Language,
  MoonPhase,
  SpellVisualizationData,
  CompleteSpellResult,
} from '@astra-arcana/spellcasting-types';

type CastSpellReturn = {
  success: boolean;
  message: string;
  timestamp: string;
  details: {
    ingredients_count: number;
    incantations_count: number;
  };
  spellResult: CompleteSpellResult;
};

// Interface for spell cast logs
export interface SpellCastLog {
  timestamp: string;
  ingredients: Ingredient[];
  incantations: Incantation[];
  success: boolean;
  message: string;
}

// Interface for filter options
export interface FilterOptions {
  name?: string;
  affinity?: Element;
  age?: Age;
  language?: Language;
  kind?: 'ritual' | 'spell' | 'support' | 'sacrifice' | 'other';
  moonphase?: MoonPhase;
}

// Custom error class for ingredient validation
export class IngredientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IngredientError';
  }
}

// Custom error class for incantation validation
export class IncantationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IncantationError';
  }
}

export class SpellcastingSDK {
  private apiUrl: string;

  constructor(apiUrl = 'https://astra-arcana-api.maxk-835.workers.dev') {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetches ingredients from the API with optional filtering
   * @param options Filter options like name, affinity, and age
   * @returns Filtered or all ingredients
   */
  async getIngredients(
    options?: Pick<FilterOptions, 'name' | 'affinity' | 'age'>
  ): Promise<Ingredient[]> {
    try {
      let url = `${this.apiUrl}/api/ingredients`;

      // Add filter parameters if options are provided
      if (options) {
        const params = new URLSearchParams();
        if (options.name) params.append('name', options.name);
        if (options.affinity) params.append('affinity', options.affinity);
        if (options.age) params.append('age', options.age);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.status}`);
      }

      const data = await response.json();
      return data as Ingredient[];
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }

  /**
   * Fetches incantations from the API with optional filtering
   * @param options Filter options like name, affinity, language, kind, and moonphase
   * @returns Filtered or all incantations
   */
  async getIncantations(
    options?: Pick<
      FilterOptions,
      'name' | 'affinity' | 'language' | 'kind' | 'moonphase'
    >
  ): Promise<Incantation[]> {
    try {
      let url = `${this.apiUrl}/api/incantations`;

      // Add filter parameters if options are provided
      if (options) {
        const params = new URLSearchParams();
        if (options.name) params.append('name', options.name);
        if (options.affinity) params.append('affinity', options.affinity);
        if (options.language) params.append('language', options.language);
        if (options.kind) params.append('kind', options.kind);
        if (options.moonphase) params.append('moonphase', options.moonphase);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch incantations: ${response.status}`);
      }

      const data = await response.json();
      return data as Incantation[];
    } catch (error) {
      console.error('Error fetching incantations:', error);
      throw error;
    }
  }

  /**
   * Fetches all available recipes from the API
   */
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/recipes`);

      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      return data as Recipe[];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  /**
   * Finds an ingredient by name
   * @param name The name of the ingredient to find
   * @returns The found ingredient or throws an error if not found
   */
  async findIngredientByName(name: string): Promise<Ingredient> {
    const ingredients = await this.getIngredients({ name });

    if (ingredients.length === 0) {
      throw new IngredientError(`Ingredient not found: ${name}`);
    }

    return ingredients[0];
  }

  /**
   * Finds an incantation by name
   * @param name The name of the incantation to find
   * @returns The found incantation or throws an error if not found
   */
  async findIncantationByName(name: string): Promise<Incantation> {
    const incantations = await this.getIncantations({ name });

    if (incantations.length === 0) {
      throw new IncantationError(`Incantation not found: ${name}`);
    }

    return incantations[0];
  }

  /**
   * Validates and resolves ingredient names to their full objects
   * @param ingredientNames Array of ingredient names to validate and resolve
   * @returns Array of validated ingredient objects
   * @throws IngredientError if any ingredient is not found
   */
  async validateIngredients(ingredientNames: string[]): Promise<Ingredient[]> {
    try {
      // Get all ingredients first for efficiency (single API call)
      const allIngredients = await this.getIngredients();
      const resolvedIngredients: Ingredient[] = [];

      for (const name of ingredientNames) {
        const ingredient = allIngredients.find(
          (i) => i.name.toLowerCase() === name.toLowerCase()
        );

        if (!ingredient) {
          throw new IngredientError(`Invalid ingredient: "${name}" not found`);
        }

        resolvedIngredients.push(ingredient);
      }

      return resolvedIngredients;
    } catch (error) {
      if (error instanceof IngredientError) {
        throw error;
      }
      throw new IngredientError(
        `Error validating ingredients: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Validates and resolves incantation names to their full objects
   * @param incantationNames Array of incantation names to validate and resolve
   * @returns Array of validated incantation objects
   * @throws IncantationError if any incantation is not found
   */
  async validateIncantations(
    incantationNames: string[]
  ): Promise<Incantation[]> {
    try {
      // Get all incantations first for efficiency (single API call)
      const allIncantations = await this.getIncantations();
      const resolvedIncantations: Incantation[] = [];

      for (const name of incantationNames) {
        const incantation = allIncantations.find(
          (i) => i.name.toLowerCase() === name.toLowerCase()
        );

        if (!incantation) {
          throw new IncantationError(
            `Invalid incantation: "${name}" not found`
          );
        }

        resolvedIncantations.push(incantation);
      }

      return resolvedIncantations;
    } catch (error) {
      if (error instanceof IncantationError) {
        throw error;
      }
      throw new IncantationError(
        `Error validating incantations: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Casts a spell with the selected ingredients and incantations
   * Accepts either objects or strings
   */
  async castSpell(
    ingredients: Ingredient[] | string[],
    incantations: Incantation[] | string[]
  ): Promise<CastSpellReturn> {
    try {
      // Validate and convert if strings were provided
      let validIngredients: Ingredient[];
      let validIncantations: Incantation[];

      if (ingredients.length > 0 && typeof ingredients[0] === 'string') {
        validIngredients = await this.validateIngredients(
          ingredients as string[]
        );
      } else {
        validIngredients = ingredients as Ingredient[];
      }

      if (incantations.length > 0 && typeof incantations[0] === 'string') {
        validIncantations = await this.validateIncantations(
          incantations as string[]
        );
      } else {
        validIncantations = incantations as Incantation[];
      }

      const response = await fetch(`${this.apiUrl}/api/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: validIngredients,
          incantations: validIncantations,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cast spell: ${response.status}`);
      }

      const data = (await response.json()) as CastSpellReturn;
      return data;
    } catch (error) {
      console.error('Error casting spell:', error);
      throw error;
    }
  }

  /**
   * Retrieves the spell cast logs from the API
   * @returns Array of spell cast logs
   */
  async getSpellLogs(): Promise<SpellCastLog[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/spell-logs`);

      if (!response.ok) {
        throw new Error(`Failed to fetch spell logs: ${response.status}`);
      }

      const data = await response.json();
      return data as SpellCastLog[];
    } catch (error) {
      console.error('Error fetching spell logs:', error);
      throw error;
    }
  }

  /**
   * Visualizes a spell with the selected ingredients and incantations without casting it
   * Accepts either objects or strings
   * @returns Visualization data for the hexagonal spellcasting UI
   */
  async visualizeSpell(
    ingredients: Ingredient[] | string[],
    incantations: Incantation[] | string[]
  ): Promise<SpellVisualizationData> {
    try {
      // Validate and convert if strings were provided
      let validIngredients: Ingredient[];
      let validIncantations: Incantation[];

      if (ingredients.length > 0 && typeof ingredients[0] === 'string') {
        validIngredients = await this.validateIngredients(
          ingredients as string[]
        );
      } else {
        validIngredients = ingredients as Ingredient[];
      }

      if (incantations.length > 0 && typeof incantations[0] === 'string') {
        validIncantations = await this.validateIncantations(
          incantations as string[]
        );
      } else {
        validIncantations = incantations as Incantation[];
      }

      const response = await fetch(`${this.apiUrl}/api/visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: validIngredients,
          incantations: validIncantations,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to visualize spell: ${response.status}`);
      }

      const data = await response.json();
      return data as SpellVisualizationData;
    } catch (error) {
      console.error('Error visualizing spell:', error);
      throw error;
    }
  }

  // Filter method removed as requested
}
