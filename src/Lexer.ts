/** Enum containing the different token types */
export enum TokenType {
    Bool,
    Comment,
    Date,
    EqualSign,
    Identifier,
    Indent,
    Number,
    String,
    Type,
    Unknown
}

const COMMENT = /^\/\/.*$/;
const DATE = /^\d{4}-\d{1,2}-\d{1,2}$/;
const IDENTIFIER = /^\t*[a-zA-Z]+([a-zA-Z]|[0-9])*$/;
const NUMBER = /^[0-9]+(\.[0-9]+)?$/;
const BOOL = /^true|false/;
const TYPE = /^bool|number|string|date$/;
const STRING = /^".*"$/;

/** Represents a token in the program input */
export class Token {
    /** The line number the token appears on */
    public lineNumber : number;

    /** The index where the token starts within the line */
    public position: number;

    /** The type of the token (number, string, etc.) */
    public tokenType: TokenType;

    /** The text that was tokenized from the program input */
    public value: string;

    /** Constructor */
    constructor(tokenType: TokenType, value: string, lineNumber: number, position: number) {
        this.lineNumber = lineNumber;
        this.position = position;
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

            if (this.currentChar == '\r' || this.currentChar == '\n') {
                 break;
            }

            this.lexeme += this.currentChar;

            this.position++;
            this.streamIndex++;
        }

        let token = new Token(TokenType.Comment, this.lexeme, this.lineNumber, this.position);
        this.tokens.push(token);
        this.lexeme = '';
        this.rewind(1);
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
        
        this.lineNumber++;
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

        let token = new Token(TokenType.String, this.lexeme, this.lineNumber, this.position);
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

            if (this.currentChar == '\r') {
                // Stupid Windows, just consume the character
                continue;
            }

            if (this.currentChar == '\n') {
                this.handleNewline();
                continue;             
            }

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

            if (this.currentChar == '\t') {
                let token = new Token(TokenType.Indent, this.currentChar, this.lineNumber, this.position);
                this.tokens.push(token);
                this.lexeme = '';

                continue;
            }

            if (this.currentChar == '=') {
                let token = new Token(TokenType.EqualSign, this.currentChar, this.lineNumber, this.position);
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
        let mappings = [
            { pattern: COMMENT, tokenType: TokenType.Comment },
            { pattern: TYPE, tokenType: TokenType.Type },
            { pattern: BOOL, tokenType: TokenType.Bool },
            { pattern: IDENTIFIER, tokenType: TokenType.Identifier },
            { pattern: NUMBER, tokenType: TokenType.Number },
            { pattern: STRING, tokenType: TokenType.String },
            { pattern: DATE, tokenType: TokenType.Date },
            { pattern: /.*/, tokenType: TokenType.Unknown }
        ];

        let match = mappings.find(element => {
            return element.pattern.test(lexeme);
        });

        return new Token(match.tokenType, lexeme, this.lineNumber, this.position);
    }

    private peekNext() : string {
        if (this.streamIndex + 1 == this.input.length) {
            return null;
        }

        return this.input[this.streamIndex+1];
    }

    private rewind(count : number) {
        this.streamIndex -= count;
        if (this.streamIndex < 0) this.streamIndex = 0;
    }    
}