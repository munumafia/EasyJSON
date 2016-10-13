import {Token} from "./Lexer";
import {TokenType} from "./Lexer";
import * as symbols from "./Symbols"
import {Node, LinkedList} from "./LinkedList"

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

        // Parse from the bottom up
        let node = symbolList.tail;
        while (node.previous != null) {
            if (node.value.symbolType == symbols.SymbolType.EqualSign) {
                let equalSign = node.value as symbols.EqualSign;
                equalSign.leftHandSide = node.previous.value;
                equalSign.rightHandSide = node.next.value;

                [node.next, node.previous].forEach(symbolList.removeNode);
            }
        }

        return null;
    }
}