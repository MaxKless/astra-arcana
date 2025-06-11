import { SpellcastingSDK } from '@astra-arcana/spellcasting-sdk';
import { Incantation, Ingredient } from '@astra-arcana/spellcasting-types';
import {
  CompletionItemKind,
  createConnection,
  InitializeParams,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';
import { findCastSpellContext } from './utils/find-cast-spell-context';
import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const sdk = new SpellcastingSDK();
let ingredients: Ingredient[] = [];
let incantations: Incantation[] = [];

const documents = new TextDocuments(TextDocument);

connection.onInitialize(async (params: InitializeParams) => {
  ingredients = await sdk.getIngredients();
  incantations = await sdk.getIncantations();

  return {
    capabilities: {
      completionProvider: {
        resolveProvider: false,
      },
    },
  };
});

connection.onCompletion((textDocumentPosition: TextDocumentPositionParams) => {
  const { isInCastSpell, argumentIndex } = findCastSpellContext(
    documents,
    textDocumentPosition
  );

  if (!isInCastSpell) {
    return [];
  }

  if (argumentIndex === 0) {
    return ingredients.map((ingredient) => ({
      label: ingredient.name,
      detail: ingredient.affinity,
      kind: CompletionItemKind.Value,
    }));
  } else if (argumentIndex === 1) {
    return incantations.map((incantation) => ({
      label: incantation.name,
      detail: incantation.affinity,
      kind: CompletionItemKind.Value,
    }));
  } else {
    return [];
  }
});

documents.listen(connection);
connection.listen();
