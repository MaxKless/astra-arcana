import {
  CompletionItem,
  CompletionItemKind,
  createConnection,
  InitializeParams,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { SpellcastingSDK } from '@astra-arcana/spellcasting-sdk';
import { Incantation, Ingredient } from '@astra-arcana/spellcasting-types';
import * as ts from 'typescript';
import { TextDocument } from 'vscode-languageserver-textdocument';

const sdk = new SpellcastingSDK();
let ingredients: Ingredient[] = [];
let incantations: Incantation[] = [];

function findCastSpellContext(
  sourceFile: ts.SourceFile,
  position: number
): { isInCastSpell: boolean; argumentIndex: number } {
  let isInCastSpell = false;
  let argumentIndex = -1;

  function visit(node: ts.Node): void {
    if (position >= node.getStart() && position <= node.getEnd()) {
      if (ts.isCallExpression(node)) {
        if (
          ts.isPropertyAccessExpression(node.expression) &&
          node.expression.name.getText() === 'castSpell'
        ) {
          isInCastSpell = true;
          // Determine which argument we're in
          for (let i = 0; i < node.arguments.length; i++) {
            const arg = node.arguments[i];
            if (position >= arg.getStart() && position <= arg.getEnd()) {
              argumentIndex = i;
              break;
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }
  }

  visit(sourceFile);
  return { isInCastSpell, argumentIndex };
}

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

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

connection.onCompletion(
  (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    if (!document) {
      return [];
    }

    const text = document.getText();
    const position = document.offsetAt(textDocumentPosition.position);

    const sourceFile = ts.createSourceFile(
      document.uri,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    const context = findCastSpellContext(sourceFile, position);

    if (!context.isInCastSpell) {
      return [];
    }

    if (context.argumentIndex === 0) {
      // First argument - ingredients
      return ingredients.map((ingredient) => ({
        label: ingredient.name,
        insertText: ingredient.name,
        detail: ingredient.affinity,
        kind: CompletionItemKind.Value,
      }));
    } else if (context.argumentIndex === 1) {
      // Second argument - incantations
      return incantations.map((incantation) => ({
        label: incantation.name,
        insertText: incantation.name,
        detail: incantation.affinity,
        kind: CompletionItemKind.Value,
      }));
    }

    return [];
  }
);

documents.listen(connection);
connection.listen();
