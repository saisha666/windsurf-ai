import * as vscode from 'vscode';

export class Dashboard {
    private panel: vscode.WebviewPanel | undefined;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    show() {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'windsurfAIDashboard',
            'Windsurf AI Dashboard',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });

        // Handle messages from webview
        this.panel.webview.onDidReceiveMessage((message: { command: string }) => {
            switch (message.command) {
                case 'startAgent':
                    vscode.commands.executeCommand('windsurf-ai.startAgent');
                    break;
                case 'analyzeCode':
                    vscode.commands.executeCommand('windsurf-ai.analyzeCode');
                    break;
            }
        });
    }

    update(data: any) {
        if (this.panel) {
            this.panel.webview.postMessage({ type: 'update', data });
        }
    }

    private getWebviewContent(): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Windsurf AI Dashboard</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .dashboard {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                    }
                    .card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                        padding: 15px;
                    }
                    .button {
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 12px;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    .button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <div class="card">
                        <h2>Active Agents</h2>
                        <div id="agents-list"></div>
                        <button class="button" onclick="startAgent()">Start New Agent</button>
                    </div>
                    <div class="card">
                        <h2>Recent Activities</h2>
                        <div id="activities-list"></div>
                    </div>
                    <div class="card">
                        <h2>Analysis Results</h2>
                        <div id="analysis-results"></div>
                        <button class="button" onclick="analyzeCode()">Analyze Current File</button>
                    </div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function startAgent() {
                        vscode.postMessage({ command: 'startAgent' });
                    }
                    
                    function analyzeCode() {
                        vscode.postMessage({ command: 'analyzeCode' });
                    }
                    
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.type) {
                            case 'update':
                                updateDashboard(message.data);
                                break;
                        }
                    });
                    
                    function updateDashboard(data) {
                        if (data.agents) {
                            document.getElementById('agents-list').innerHTML = 
                                data.agents.map(agent => 
                                    \`<div>\${agent.type} (\${agent.status})</div>\`
                                ).join('');
                        }
                        
                        if (data.activities) {
                            document.getElementById('activities-list').innerHTML = 
                                data.activities.map(activity => 
                                    \`<div>\${activity.timestamp}: \${activity.description}</div>\`
                                ).join('');
                        }
                        
                        if (data.analysis) {
                            document.getElementById('analysis-results').innerHTML = 
                                \`<pre>\${JSON.stringify(data.analysis, null, 2)}</pre>\`;
                        }
                    }
                </script>
            </body>
            </html>
        `;
    }
}
