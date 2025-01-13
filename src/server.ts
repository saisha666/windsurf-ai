import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    InitializeParams,
    TextDocumentSyncKind,
    InitializeResult
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { CodeAnalyzer } from './analysis/analyzer';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const analyzer = new CodeAnalyzer();

connection.onInitialize((params: InitializeParams) => {
    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // Add more capabilities as needed
            hoverProvider: true,
            completionProvider: {
                triggerCharacters: ['.']
            },
            codeActionProvider: true
        }
    };
    return result;
});

// Listen for text document changes
documents.onDidChangeContent(async change => {
    const textDocument = change.document;
    const analysis = await analyzer.analyzeCode(textDocument.getText());
    
    // Send diagnostics
    connection.sendDiagnostics({
        uri: textDocument.uri,
        diagnostics: analysis.suggestions.map(suggestion => ({
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 0 }
            },
            message: suggestion,
            severity: 2 // Warning
        }))
    });
});

// Listen for hover requests
connection.onHover(async ({ textDocument, position }) => {
    const document = documents.get(textDocument.uri);
    if (document) {
        const analysis = await analyzer.analyzeCode(document.getText());
        return {
            contents: {
                kind: 'markdown',
                value: `### Code Analysis\n${JSON.stringify(analysis, null, 2)}`
            }
        };
    }
    return null;
});

// Make the text document manager listen on the connection
documents.listen(connection);

// Listen on the connection
connection.listen();
