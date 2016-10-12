import {Token} from "./Lexer";
import {TokenType} from "./Lexer";

enum SymbolType {
    Comment,
    Document,
    EqualSign,
    Identifier,
    String,
    Tab,
    Type,
    Unknown
}

interface IVisitor {
    visitComment(comment : Comment) : void;
    visitDocument(document : Document) : void; 
    visitEqualSign(equalSign: EqualSign) : void;
    visitIdentifier(identifier : Identifier) : void;
    visitType(type : Type) : void;  
}

interface ISymbol {
    /** The line number within the source file where the symbol appears */
    lineNumber : number;

    /** The parent symbol that this symbol belongs to */
    parent : ISymbol;

    /** The starting position within the line where the symbol appears */
    position : number;

    /** The type of the symbol */
    symbolType: SymbolType;

    /** The source text associated with the symbol */
    text: string;

    /** Method for implementing the visitor pattern */
    visit(visitor : IVisitor) : void;
}

abstract class Symbol implements ISymbol {
    public lineNumber : number;
    public parent : ISymbol;
    public position : number;
    public symbolType : SymbolType;
    public text : string;

    constructor(lineNumber : number, parent : ISymbol, position : number, symbolType : SymbolType, text : string) {
        this.lineNumber = lineNumber;
        this.parent = parent;
        this.position = position;
        this.symbolType = symbolType;
        this.text = text;
    }

    abstract visit(visitor : IVisitor) : void;
}

class Comment extends Symbol {
    public constructor(lineNumber : number, parent : ISymbol, position : number, text : string) {
        super(lineNumber, parent, position, SymbolType.Comment, text);        
    }

    public visit(visitor : IVisitor) {
        visitor.visitComment(this);
    }
}

class Document extends Symbol {
    /** Ordered list of all the child symbols that belong to the document (comments, identifiers, etc.) */
    public children : ISymbol[];

    public constructor(text: string) {
        super(0, null, 0, SymbolType.Document, text);        
    }

    public visit(visitor : IVisitor) {
        visitor.visitDocument(this);
    }
}

class EqualSign extends Symbol {
    public leftHandSide : ISymbol;
    public rightHandSide : ISymbol;

    public constructor(lineNumber : number, parent : ISymbol, position : number, text : string) {
        super(lineNumber, parent, position, SymbolType.EqualSign, text);        
    }

    public visit(visitor : IVisitor) {
        visitor.visitEqualSign(this);
    }
}

class Type extends Symbol {
    public constructor(lineNumber : number, parent : ISymbol, position : number, text : string) {
        super(lineNumber, parent, position, SymbolType.EqualSign, text);        
    }

    public visit(visitor : IVisitor) {
        visitor.visitIdentifier(this);
    }
}

class Identifier extends Symbol {
       
    public constructor(lineNumber : number, parent : ISymbol, position : number, text : string) {
        super(lineNumber, parent, position, SymbolType.EqualSign, text);        
    }

    public visit(visitor : IVisitor) {
        visitor.visitIdentifier(this);
    }
}

class AbstractSyntaxTreeVisitor implements IVisitor {
    public visitComment(comment : Comment) {
        // ...
    }

    public visitDocument(document : Document) {
        // ...
    }

    public visitEqualSign(equalSign : EqualSign) {
        // ...
    }

    public visitIdentifier(identifier : Identifier) {
        // ...
    }

    public visitType(type : Type) {
        // ...
    }
}

class TokenToSymbolMapper {
    public map(token : Token) : ISymbol {
        switch (token.tokenType) {
            case TokenType.Comment:
                return this.mapComment(token);
            case TokenType.EqualSign:
                return this.mapEqualSign(token);
            case TokenType.Identifier:
                return this.mapIdentifier(token);
            case TokenType.String:
                return this.mapString(token);
            case TokenType.Tab:
                return this.mapTab(token);
            case TokenType.Type:
                return this.mapType(token);
            default:
                throw "Unknown token encountered";
        }
    }

    private mapComment(token : Token) : ISymbol {
        return null;
    }

    private mapEqualSign(token : Token) : ISymbol {
        return null;
    }

    private mapIdentifier(token : Token) : ISymbol {
        return null;
    }

    private mapString(token : Token) : ISymbol {
        return null;
    }

    private mapTab(token : Token) : ISymbol {
        return null;
    }

    private mapType(token : Token) : ISymbol {
        return null;
    }
}

class Node<TValue> {
    public previous : Node<TValue>;
    public next : Node<TValue>;
    public value: TValue;
}

class LinkedList<TValue> {
    public head : Node<TValue>;
    public tail : Node<TValue>;

    public insertBefore(node : Node<TValue>, target : Node<TValue>) {
        if (target === this.head) {
            
        }
    }
}

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

        // First round of parsing, convert all tokens to symbols
        let symbols = this.tokens.map(token => mapper.map(token));

        return null;
    }
}