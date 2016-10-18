import {Token} from "./Lexer";
import {TokenType} from "./Lexer";
import * as symbols from "./Symbols"
import {Node, LinkedList} from "./LinkedList"

function printList(list : LinkedList<symbols.ISymbol>) {
    let node = list.head;
    while (node != null) {
        console.log(node);
        node = node.next;
    }
}

function printSymbols(list : LinkedList<symbols.ISymbol>) {
    let node = list.head;
    while (node != null) { 
        console.log(node.value);
        node = node.next;
    }
}

export class Parser {
    private document : symbols.Document;
    private tokens : Token[] = [];

    public constructor(tokens : Token[], programText : string) {
        this.tokens = tokens;
        this.document = new symbols.Document(programText);
    }

    public parse() : Document {
        let document = this.document;
        let mapper = new symbols.TokenToSymbolMapper();

        // First round of parsing, convert all tokens to symbols and create
        // a linked list
        let symbolList = new LinkedList<symbols.ISymbol>();
        this.tokens.forEach(token => {
            let symbol = mapper.map(token)
            let node = new Node<symbols.ISymbol>(symbol);
            symbolList.push(node);
        });

        // Second round, handle any identifiers
        this.handleIdentifiers(symbolList);
        console.log("Handled identifiers");

        //printList(symbolList);

        // Third round, handle any assignments
        this.handleEqualSign(symbolList);
        console.log("Handled equal sign");

        // Third round, convert to statements
        this.handleStatements(symbolList);

        // Fourth round, convert to blocks

        //printList(symbolList);
        printSymbols(symbolList);

        return null;
    }

    private handleEqualSign(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node != null) {
            if (node.value.symbolType !== symbols.SymbolType.EqualSign) {
                node = node.next;
                continue;
            }
                
            if (node.previous != null && node.previous.value.symbolType != symbols.SymbolType.Identifier) {
                console.log(`Expected Identifier, got ${typeof node.previous.value}`);
                node = node.next;
                continue;
            }

            if (node.next != null && !(node.next.value instanceof symbols.ValueSymbol)) {
                console.log(`Expected value, got ${typeof node.next.value}`);
                node = node.next;
                continue;
            }

            let equalSign = node.value as symbols.EqualSign;
            equalSign.leftHandSide = node.previous.value;
            equalSign.rightHandSide = node.next.value;

            symbolList.removeNode(node.previous);
            symbolList.removeNode(node.next);            

            node = node.next;
        }
        
    }

    private handleIdentifiers(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node) {
            if (node.value && node.value && node.value.symbolType !== symbols.SymbolType.Identifier) {
                node = node.next;
                continue;
            }

            let symbol = node.value as symbols.Identifier;
            if (node.next && node.next.value && node.next.value instanceof symbols.Type) {
                symbol.type = node.next.value;
                symbolList.removeNode(node.next);
            }

            node = node.next;           
        } 
    }

    private handleStatements(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node != null) {
            let symbol = node.value;

            if (symbol.symbolType == symbols.SymbolType.EqualSign) {
                let equalSign = symbol as symbols.EqualSign;
                let statement = new symbols.AssignmentSymbol(equalSign.lineNumber, null, equalSign.position, equalSign.text);
                statement.leftHandSide = equalSign.leftHandSide;
                statement.rightHandSide = equalSign.rightHandSide;

                symbolList.insertAfter(new Node(statement), node);
                symbolList.removeNode(node);

                node = node.next;
                continue;
            }

            if (symbol.symbolType == symbols.SymbolType.Identifier) {
                let statement = new symbols.DeclarationSymbol(symbol.lineNumber, null, symbol.position, symbol.text);
                symbolList.insertAfter(new Node(statement), node);
                symbolList.removeNode(node);

                node = node.next;
                continue;
            }

            node = node.next;
        }
    }
}