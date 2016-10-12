/** Enum containing the different token types */
export enum TokenType {
    Comment,
    Date,
    EqualSign,
    Identifier,
    Indent,
    Number,
    String,
    Tab,
    Type,
    Unknown
}

const COMMENT = /^\/\/.*$/;
const IDENTIFIER = /^\t*[a-zA-Z]+([a-zA-Z]|[0-9])*$/;
const NUMBER = /^[0-9]+(\.[0-9]+)?$/;
const TYPE = /^bool|number|string|date$/;
const STRING = /^".*"$/;

/** Represents a token in the program input */
export class Token {
    public tokenType: TokenType;
    public value: string;

    constructor(tokenType: TokenType, value: string) {
        this.tokenType = tokenType;
        this.value = value;
    }
}

/** Class for perfoming lexical analysis on a program */
export class Lexer {
    private currentChar : string;
    private input : string;
    private lexeme : string;
    private lineNumber : number;
    private position : number;
    private streamIndex : number;
    private tokens : Token[] = [];

    private handleComment() {
        this.lexeme = this.currentChar;
        this.streamIndex += 1;
        this.position += 1;

        while (!this.isEol() && this.peekNext() != null) {
            this.currentChar = this.input[this.streamIndex];

            if (this.currentChar == '\r') {
                this.position += 2;
                break;
            } 
            
            if (this.currentChar == '\n') {
                this.position += 1;
                break;
            }

            this.lexeme += this.currentChar;

            this.position++;
            this.streamIndex++;
        }

        let token = new Token(TokenType.Comment, this.lexeme);
        this.tokens.push(token);
        this.lexeme = '';
    }

    private handleSpace() {
        if (this.lexeme.length > 0) {
            let token = this.matchToken(this.lexeme);
            this.tokens.push(token);
        }

        this.lexeme = '';
        this.position++;
    }

    private handleNewline() {
        if (this.lexeme.length > 0) {
            let token = this.matchToken(this.lexeme);
            this.tokens.push(token);
        }
        
        this.lineNumber = 1;
        this.position = 0;
        this.lexeme = '';
    }

    private handleString() {
        this.lexeme = this.currentChar;
        this.streamIndex += 1;
        this.position += 1;

        while (!this.isEol() && this.peekNext() != null) {
            this.currentChar = this.input[this.streamIndex];
            this.lexeme += this.currentChar;

            if (this.currentChar == '"') break;

            this.position++;
            this.streamIndex++;
        }

        let token = new Token(TokenType.String, this.lexeme);
        this.tokens.push(token);
        this.lexeme = '';
    }

    private isEol() : boolean {
        return this.currentChar == '\n' || (this.currentChar == '\r' && this.peekNext() == '\n');
    }

    public lex(input: string) : Token[] {
        this.input = input;
        this.lexeme = '';
        this.lineNumber = 1;
        this.position = 1;
        this.tokens = [];

        for (this.streamIndex = 0; this.streamIndex < this.input.length; this.streamIndex++) {
            this.currentChar = input[this.streamIndex];

            if (this.currentChar == '/' && this.peekNext() == '/') {
                this.handleComment();
                continue;
            }
            
            if (this.currentChar == '"') {
                this.handleString();
                continue;
            }

            if (this.currentChar == ' ') {
                this.handleSpace();
                continue;
            }

            if (this.currentChar == '\n' || (this.currentChar == '\r' && this.peekNext() == '\n')) {
                this.handleNewline();
                continue;             
            }

            if (this.currentChar == '\t') {
                let token = new Token(TokenType.Indent, this.currentChar);
                this.tokens.push(token);
                this.lexeme = '';

                continue;
            }

            if (this.currentChar == '=') {
                let token = new Token(TokenType.EqualSign, this.currentChar);
                this.tokens.push(token);
                this.position++;
                this.lexeme = '';
                
                continue;
            }

            this.lexeme += this.currentChar;
        }

        return this.tokens;
    }

    private matchToken(lexeme : string) : Token {
        if (COMMENT.test(lexeme)) {
            let token = new Token(TokenType.Comment, lexeme);
            return token;
        }

        if (TYPE.test(lexeme)) {
            let token = new Token(TokenType.Type, lexeme);
            return token;
        }

        if (IDENTIFIER.test(lexeme)) {
            let token = new Token(TokenType.Identifier, lexeme);
            return token;
        }

        if (NUMBER.test(lexeme)) {
            let token = new Token(TokenType.Number, lexeme);
            return token;
        }

        if (STRING.test(lexeme)) {
            let token = new Token(TokenType.String, lexeme);
            return token;
        }

        if (Date.parse(lexeme) != NaN) {
            let token = new Token(TokenType.Date, lexeme);
            return token;
        }

        // Nothing matched
        return new Token(TokenType.Unknown, lexeme);
    }

    private peekNext() : string {
        if (this.streamIndex + 1 == this.input.length) {
            return null;
        }

        return this.input[this.streamIndex+1];
    }

    
}