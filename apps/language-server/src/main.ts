import {
  ClientCapabilities,
  CompletionItem,
  CompletionItemKind,
  createConnection,
  DidChangeConfigurationNotification,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  return {
    capabilities: {
      completionProvider: {
        resolveProvider: false,
      },
    },
  };
});

connection.onCompletion(
  (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    connection.console.log('completion request received');
    return [
      {
        label: 'hello world',
        detail: 'Hello World completion',
        kind: CompletionItemKind.Text,
        data: 1,
      },
    ];
  }
);

documents.listen(connection);
connection.listen();
