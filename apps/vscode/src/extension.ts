import { SpellcastingSDK } from '@astra-arcana/spellcasting-sdk';
import * as vscode from 'vscode';
import { window } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

async function setupLanguageServer(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath('./language-server/main.js');
  console.log(serverModule);
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'typescriptreact' },
    ],
    synchronize: {},
    outputChannel: window.createOutputChannel('Astra Arcana Language Server'),
  };

  client = new LanguageClient(
    'astraArcanaLanguageServer',
    'Astra Arcana Language Server',
    serverOptions,
    clientOptions
  );

  await client.start();
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('extension "astra-arcana" is now active!');

  const sdk = new SpellcastingSDK();
  const disposable = vscode.commands.registerCommand(
    'astra-arcana.cast-spell',
    async () => {
      const ingredients = await sdk.getIngredients();
      const selectedIngredients = await vscode.window.showQuickPick(
        ingredients.map((ingredient) => ingredient.name),
        {
          placeHolder: 'Select an ingredient',
          canPickMany: true,
        }
      );
      if (!selectedIngredients) {
        return;
      }

      const spell = await sdk.castSpell(selectedIngredients, []);
      vscode.window.showInformationMessage(`Spell cast: ${spell}`);
    }
  );

  await setupLanguageServer(context);

  context.subscriptions.push(disposable);
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
