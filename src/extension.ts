'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from "lodash";

import {
	Chaos
} from "./chaos";


let chaos = new Chaos();

const KEYWORDS_PATTERN = /^---[ \t]*\n((?:[ \t]*[^ \t:]+[ \t]*:[^\n]*\n)+)---/;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let add_chaos = vscode.commands.registerCommand('extension.add_chaos', () => addKeywords());
	let add_chaos_en = vscode.commands.registerCommand('extension.add_chaos_en', () => addChaosEnSelection());

	context.subscriptions.push(add_chaos);
	context.subscriptions.push(add_chaos_en);
}

function addKeywords() {
	
	let editor = vscode.window.activeTextEditor;

	let document = editor.document;
	let meta=exactKeywords(document.getText()).metadata;
	let keywords=meta["keywords"];

	let selections = editor.selections;
	editor.edit(function (edit) {
		for (var x = 0; x < selections.length; x++) {
			let txt: string = document.getText(new vscode.Range(selections[x].start, selections[x].end));
			edit.replace(selections[x], chaos.keyword(txt,keywords));
		}
	});
}

function addChaosSelection() {
	let editor = vscode.window.activeTextEditor;
	let document = editor.document;
	let selections = editor.selections;
	editor.edit(function (edit) {
		for (var x = 0; x < selections.length; x++) {
			let txt: string = document.getText(new vscode.Range(selections[x].start, selections[x].end));
			edit.replace(selections[x], chaos.spacing(txt));
		}
	});
}

function addChaosEnSelection() {
	let editor = vscode.window.activeTextEditor;
	let document = editor.document;
	let selections = editor.selections;
	editor.edit(function (edit) {
		for (var x = 0; x < selections.length; x++) {
			let txt: string = document.getText(new vscode.Range(selections[x].start, selections[x].end));
			edit.replace(selections[x], chaos.english(txt));
		}
	});
}


function exactKeywords(text) {
	let metadata = {};
	if (_.startsWith(text, "---")) {
		let match = KEYWORDS_PATTERN.exec(text);
		if (match) {
			let metadataStr = match[1].trim();
			let metaArray = metadataStr.split("\n");
			metaArray.forEach(value => {
				let entry = value.split(":");
				metadata[entry[0]] = entry[1].trim();
			});
			if (metadata["keywords"]) {
				let keywordsStr = metadata["keywords"];
				metadata["keywords"] = keywordsStr.split(",").map(value => value.trim());
			}
		}
	}
	return {
		"metadata": metadata
	};
}