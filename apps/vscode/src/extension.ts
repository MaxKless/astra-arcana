import { SpellcastingSDK } from '@astra-arcana/spellcasting-sdk';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
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

  context.subscriptions.push(disposable);
}

export function deactivate() {}
