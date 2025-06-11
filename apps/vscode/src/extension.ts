import { SpellcastingSDK } from '@astra-arcana/spellcasting-sdk';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand('astra-arcana.cast-spell', async () => {
    const sdk = new SpellcastingSDK();

    const ingredients = await sdk.getIngredients();

    const selectedIngredients = await vscode.window.showQuickPick(
      ingredients.map((i) => i.name),
      {
        canPickMany: true,
        title: 'select ingredients for spell',
      }
    );

    if (!selectedIngredients) {
      return;
    }

    const incantations = await sdk.getIncantations();
    const selectedIncantations = await vscode.window.showQuickPick(
      incantations.map((i) => i.name),
      {
        canPickMany: true,
        title: 'select incantations for the spell',
      }
    );

    if (!selectedIncantations) {
      return;
    }

    const spell = await sdk.castSpell(
      selectedIngredients,
      selectedIncantations
    );

    if (spell.success) {
      vscode.window.showInformationMessage(
        `spell cast successfully: ${spell.message}`
      );
    } else {
      vscode.window.showErrorMessage(`spell failed: ${spell.message}`);
    }
  });

  await setupLanguageServer(context);
}

async function setupLanguageServer(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath('./language-server/main.js');
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
    outputChannel: vscode.window.createOutputChannel(
      'Astra Arcana Language Server'
    ),
  };

  client = new LanguageClient(
    'astraArcanaLanguageServer',
    'Astra Arcana Language Server',
    serverOptions,
    clientOptions
  );

  await client.start();
}

export function deactivate() {}
