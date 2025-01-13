import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { AgentManager } from './agents/manager';
import { CodeAnalyzer } from './analysis/analyzer';

let client: LanguageClient;
let agentManager: AgentManager;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Activating Windsurf AI Extension');

    // Initialize agent manager
    agentManager = new AgentManager();
    
    // Initialize language client
    const serverModule = context.asAbsolutePath('dist/server.js');
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'python' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'javascript' }
        ]
    };

    client = new LanguageClient(
        'windsurf-ai',
        'Windsurf AI',
        serverOptions,
        clientOptions
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('windsurf-ai.startAgent', async () => {
            const agentType = await vscode.window.showQuickPick([
                'Research Agent',
                'Code Analysis Agent',
                'Documentation Agent'
            ], {
                placeHolder: 'Select agent type to start'
            });

            if (agentType) {
                await agentManager.startAgent(agentType);
                vscode.window.showInformationMessage(`Started ${agentType}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('windsurf-ai.analyzeCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const analyzer = new CodeAnalyzer();
                const analysis = await analyzer.analyzeCode(document.getText());
                
                // Show analysis results
                const panel = vscode.window.createWebviewPanel(
                    'codeAnalysis',
                    'Code Analysis Results',
                    vscode.ViewColumn.Two,
                    {}
                );
                
                panel.webview.html = getWebviewContent(analysis);
            }
        })
    );

    // Start the client
    await client.start();
}

export function deactivate(): Thenable<void> | undefined {
    agentManager.stopAllAgents();
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function getWebviewContent(analysis: any): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Analysis</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .analysis-item { margin-bottom: 20px; }
                .highlight { background-color: #e6f3ff; padding: 10px; }
            </style>
        </head>
        <body>
            <h1>Code Analysis Results</h1>
            <div class="analysis-results">
                ${JSON.stringify(analysis, null, 2)}
            </div>
        </body>
        </html>
    `;
}
