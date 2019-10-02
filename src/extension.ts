'use strict';

import * as vscode from 'vscode';
var convert = require('xml-js');
export function activate(context: vscode.ExtensionContext) {

    // 👎 formatter implemented as separate command
    vscode.commands.registerCommand('extension.azure-publishsettings', () => {
        const { activeTextEditor } = vscode.window;

        if (activeTextEditor && activeTextEditor.document.languageId === 'azure-publishsettings') {
            const { document } = activeTextEditor;
            if (!document.isUntitled && document.fileName.toLowerCase().endsWith(".publishsettings")) {
                const entireContent = document.getText();
                const edit = new vscode.WorkspaceEdit();
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(entireContent.length - 1)
                );
                const convertedContent = convert.xml2json(entireContent, { compact: true, spaces: 4 });
                edit.replace(document.uri, fullRange, convertedContent);
                return vscode.workspace.applyEdit(edit)
            }
        }
    });

    // 👍 formatter implemented using API
    vscode.languages.registerDocumentFormattingEditProvider('azure-publishsettings', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            if (!document.isUntitled && document.fileName.toLowerCase().endsWith(".publishsettings")) {
                const entireContent = document.getText();
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(entireContent.length - 1)
                );
                const convertedContent = convert.xml2json(entireContent, { compact: true, spaces: 4 });
                return [vscode.TextEdit.replace(fullRange, convertedContent)];
            }
        }
    });
}
