import {
  SpellcastingSDK,
  IngredientError,
  IncantationError,
} from '@astra-arcana/typescript-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'Astra Arcana',
  version: '1.0.0',
});

const sdk = new SpellcastingSDK();

server.tool('get-ingredients', async () => {
  try {
    const ingredients = await sdk.getIngredients();
    return {
      content: [{ type: 'text', text: JSON.stringify(ingredients) }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        { type: 'text', text: JSON.stringify({ error: errorMessage }) },
      ],
    };
  }
});

server.tool('get-incantations', async () => {
  try {
    const incantations = await sdk.getIncantations();
    return {
      content: [{ type: 'text', text: JSON.stringify(incantations) }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        { type: 'text', text: JSON.stringify({ error: errorMessage }) },
      ],
    };
  }
});

server.tool('get-recipes', async () => {
  try {
    const recipes = await sdk.getRecipes();
    return {
      content: [{ type: 'text', text: JSON.stringify(recipes) }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        { type: 'text', text: JSON.stringify({ error: errorMessage }) },
      ],
    };
  }
});

server.tool(
  'cast-spell',
  { ingredients: z.array(z.string()), incantations: z.array(z.string()) },
  async ({ ingredients, incantations }) => {
    try {
      // With our updated SDK, we can now pass strings directly to castSpell
      const result = await sdk.castSpell(ingredients, incantations);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    } catch (error) {
      let errorMessage: string;

      if (error instanceof IngredientError) {
        errorMessage = `Ingredient Error: ${error.message}`;
      } else if (error instanceof IncantationError) {
        errorMessage = `Incantation Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      return {
        isError: true,
        content: [
          { type: 'text', text: JSON.stringify({ error: errorMessage }) },
        ],
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
