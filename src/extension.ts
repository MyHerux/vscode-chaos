'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Chaos } from "./chaos";
let chaos = new Chaos();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chaos" is now active!');

	let add_chaos = vscode.commands.registerCommand('extension.add_chaos', () => addChaosSelection());

	context.subscriptions.push(add_chaos);
}

function addChaos(editor: vscode.TextEditor, document: vscode.TextDocument, selections: vscode.Selection[]) {
	editor.edit(function (edit) {
		for (var x = 0; x < selections.length; x++) {
			let txt: string = document.getText(new vscode.Range(selections[x].start, selections[x].end));
			edit.replace(selections[x], chaos.spacing(txt));
		}
	});
}

function addChaosSelection() {
	let editor = vscode.window.activeTextEditor;
	let document =editor.document;
	let selections = editor.selections;
	addChaos(editor,document,selections);
}