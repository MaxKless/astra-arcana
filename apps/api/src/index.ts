import {
  CompleteSpellResult,
  Incantation,
  Ingredient,
} from '@astra-arcana/spellcasting-types';
import { defaultIncantations, defaultIngredients } from './default-data';
import { defaultRecipes } from './default-recipes';
import { calculateCompleteSpellResult } from './hexagonal-spellcasting/calculator';
import { generateVisualizationData } from './hexagonal-spellcasting/visualization';

// Use the default data from the separate files
const ingredients = defaultIngredients;
const incantations = defaultIncantations;
const recipes = defaultRecipes;

interface SpellCastLog {
  timestamp: string;
  ingredients: Ingredient[];
  incantations: Incantation[];
  success: boolean;
  message: string;
  spellResult?: CompleteSpellResult;
}

/**
 * Interface for the application environment
 */
interface Env {
  // KV namespace binding for spell logs
  SPELL_LOGS: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS requests (for CORS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Allow GET and POST requests based on the endpoint
    if (path === '/api/cast') {
      // Only allow POST for the cast endpoint
      if (request.method !== 'POST') {
        return new Response('Method not allowed for this endpoint', {
          status: 405,
          headers: corsHeaders,
        });
      }

      try {
        // Parse the JSON body with proper typing
        const data = (await request.json()) as {
          ingredients?: Ingredient[];
          incantations?: Incantation[];
        };
        const { ingredients = [], incantations = [] } = data;

        // Calculate spell result using the hexagonal spellcasting system
        const spellResult = calculateCompleteSpellResult(
          ingredients,
          incantations
        );

        const timestamp = new Date().toISOString();
        const success = spellResult.success;
        const message = success
          ? spellResult.spellDescription
          : 'Spell failed to cast correctly.';

        // Create log entry
        const logEntry: SpellCastLog = {
          timestamp,
          ingredients,
          incantations,
          success,
          message,
          spellResult,
        };

        // Get existing logs from KV
        let logsArray: SpellCastLog[] = [];
        const logsString = await env.SPELL_LOGS.get('spellLogs');

        if (logsString) {
          logsArray = JSON.parse(logsString);
        }

        // Add new log entry
        logsArray.push(logEntry);

        // Limit to most recent 100 entries
        if (logsArray.length > 100) {
          logsArray = logsArray.slice(-100);
        }

        // Store updated logs back to KV
        await env.SPELL_LOGS.put('spellLogs', JSON.stringify(logsArray));

        return new Response(
          JSON.stringify({
            success,
            message,
            timestamp,
            details: {
              ingredients_count: ingredients?.length || 0,
              incantations_count: incantations?.length || 0,
            },
            // Return the complete hexagonal spellcasting result
            spellResult,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request data',
            message: error instanceof Error ? error.message : 'Unknown error',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // The visualization endpoint accepts POST requests
    if (path === '/api/visualize') {
      // Only allow POST for the visualize endpoint
      if (request.method !== 'POST') {
        return new Response('Method not allowed for this endpoint', {
          status: 405,
          headers: corsHeaders,
        });
      }

      try {
        // Parse the JSON body with proper typing
        const data = (await request.json()) as {
          ingredients?: Ingredient[];
          incantations?: Incantation[];
        };
        const { ingredients = [], incantations = [] } = data;

        // Generate visualization data without actually casting the spell
        const visualizationData = generateVisualizationData(
          ingredients,
          incantations
        );

        return new Response(JSON.stringify(visualizationData), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request data',
            message: error instanceof Error ? error.message : 'Unknown error',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // For other endpoints, only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    // Route to appropriate endpoint
    if (path === '/api/ingredients') {
      // Get filter parameters from query string
      const params = url.searchParams;

      // Extract filter parameters relevant to ingredients
      const name = params.get('name')?.toLowerCase();
      const affinity = params.get('affinity');
      const age = params.get('age');

      // Apply filters if any parameters are provided
      let results = ingredients;
      if (name || affinity || age) {
        results = ingredients.filter((ingredient) => {
          // Check each filter condition
          if (name && !ingredient.name.toLowerCase().includes(name))
            return false;
          if (affinity && ingredient.affinity !== affinity) return false;
          if (age && ingredient.age !== age) return false;

          return true; // Include if passes all filters
        });
      }

      return new Response(JSON.stringify(results), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else if (path === '/api/incantations') {
      // Get filter parameters from query string
      const params = url.searchParams;

      // Extract filter parameters relevant to incantations
      const name = params.get('name')?.toLowerCase();
      const affinity = params.get('affinity');
      const language = params.get('language');
      const kind = params.get('kind');
      const moonphase = params.get('moonphase');

      // Apply filters if any parameters are provided
      let results = incantations;
      if (name || affinity || language || kind || moonphase) {
        results = incantations.filter((incantation) => {
          // Check each filter condition
          if (name && !incantation.name.toLowerCase().includes(name))
            return false;
          if (affinity && incantation.affinity !== affinity) return false;
          if (language && incantation.language !== language) return false;
          if (kind && incantation.kind !== kind) return false;
          if (moonphase && incantation.moonphase !== moonphase) return false;

          return true; // Include if passes all filters
        });
      }

      return new Response(JSON.stringify(results), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else if (path === '/api/recipes') {
      // Return the full recipe objects
      return new Response(JSON.stringify(recipes), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else if (path === '/api/spell-logs') {
      // Return the spell cast logs from KV
      const logsString = await env.SPELL_LOGS.get('spellLogs');
      const logs = logsString ? JSON.parse(logsString) : [];

      return new Response(JSON.stringify(logs), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else if (path === '/' || path === '/api') {
      return new Response(
        JSON.stringify({
          message: 'Welcome to the Astra Arcana API',
          endpoints: {
            ingredients: '/api/ingredients?name=...&affinity=...&age=...',
            incantations:
              '/api/incantations?name=...&affinity=...&language=...&kind=...&moonphase=...',
            recipes: '/api/recipes',
            cast: '/api/cast',
            visualize: '/api/visualize',
            spellLogs: '/api/spell-logs',
          },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
} satisfies ExportedHandler<Env>;
