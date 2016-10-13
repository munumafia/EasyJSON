import {Token} from "./Lexer";
import {TokenType} from "./Lexer";
import {TokenToSymbolMapper, Document, ISymbol} from "./Symbols"
import {Node, LinkedList} from "./LinkedList"

export class Parser {
    private document : Document;
    private tokens : Token[] = [];

    public constructor(tokens : Token[], programText : string) {
        this.tokens = tokens;
        this.document = new Document(programText);
    }

    public parse() : Document {
        let document = this.document;
        let mapper = new TokenToSymbolMapper();

        // First round of parsing, convert all tokens to symbols and create
        // a linked list
        let symbolList = new LinkedList<ISymbol>();
        let symbols = this.tokens.map(token => {
            let symbol = mapper.map(token)
            let node = new Node<ISymbol>(symbol);
            symbolList.push(node);
        });

        return null;
    }
}