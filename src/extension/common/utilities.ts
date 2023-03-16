// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as path from 'path';
import { Uri, WorkspaceFolder } from 'vscode';
import { Trace } from 'vscode-jsonrpc/node';
import { DocumentSelector } from 'vscode-languageclient';
import { getWorkspaceFolders, isVirtualWorkspace } from './vscodeapi';

export function getTimeForLogging(): string {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
}

export function traceLevelToLSTrace(level: string): Trace {
    switch (level) {
        case 'error':
        case 'warn':
        case 'info':
            return Trace.Messages;
        case 'debug':
            return Trace.Verbose;
        default:
            return Trace.Off;
    }
}

export function getProjectRoot(): WorkspaceFolder {
    const workspaces: readonly WorkspaceFolder[] = getWorkspaceFolders();
    if (workspaces.length === 0) {
        return {
            uri: Uri.file(process.cwd()),
            name: path.basename(process.cwd()),
            index: 0,
        };
    } else if (workspaces.length === 1) {
        return workspaces[0];
    } else {
        let root = workspaces[0].uri.fsPath;
        let rootWorkspace = workspaces[0];
        for (const w of workspaces) {
            if (root.length > w.uri.fsPath.length) {
                root = w.uri.fsPath;
                rootWorkspace = w;
            }
        }
        return rootWorkspace;
    }
}

export function getDocumentSelector(): DocumentSelector {
    return isVirtualWorkspace()
        ? [{ language: 'python' }]
        : [
              { scheme: 'file', language: 'python' },
              { scheme: 'untitled', language: 'python' },
              { scheme: 'vscode-notebook', language: 'python' },
              { scheme: 'vscode-notebook-cell', language: 'python' },
          ];
}

/**
 * Returns the elements of an array that meet the condition specified in an async callback function.
 * @param asyncPredicate The filter method calls the async predicate function one time for each element in the array.
 */
export async function asyncFilter<T>(arr: T[], asyncPredicate: (value: T) => Promise<unknown>): Promise<T[]> {
    const results = await Promise.all(arr.map(asyncPredicate));
    return arr.filter((_v, index) => results[index]);
}

export async function asyncForEach<T>(arr: T[], asyncFunc: (value: T) => Promise<void>): Promise<void> {
    await Promise.all(arr.map(asyncFunc));
}
