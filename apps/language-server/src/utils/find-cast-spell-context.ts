import {
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as ts from 'typescript';

// check whether the current position is inside a castSpell call
// and if yes, whether it's in the first or second argument
export function findCastSpellContext(
  documents: TextDocuments<TextDocument>,
  textDocumentPosition: TextDocumentPositionParams
): {
  isInCastSpell: boolean;
  argumentIndex: number;
} {
  const document = documents.get(textDocumentPosition.textDocument.uri);
  if (!document) {
    return {
      isInCastSpell: false,
      argumentIndex: -1,
    };
  }
  const text = document.getText();
  const position = document.offsetAt(textDocumentPosition.position);

  const sourceFile = ts.createSourceFile(
    document.uri,
    text,
    ts.ScriptTarget.Latest,
    true
  );

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
