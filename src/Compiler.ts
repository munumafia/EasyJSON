import {LinkedList, Node} from './LinkedList';
import * as symbols from './Symbols';
import {Visitor} from './Visitors';

class SymbolVisitor extends Visitor {
    private indentSpaces : string;
    private output : string = "";
    private scopeStack : symbols.BlockSymbol[] = [];

    constructor(indentSpaceCount : number) {
        super();
        this.indentSpaces = this.repeatText(" ", indentSpaceCount);
    }

    private findIndentLevel(symbol : symbols.ISymbol) : number {
        let indentLevel = 0;
        let parent = symbol.parent;

        while (parent != null) {
            if (parent instanceof symbols.BlockSymbol) {
                const block = parent as symbols.BlockSymbol;
                indentLevel = block.indentLevel + 1;
                break;
            }
        }

        return indentLevel;
    }

    private repeatText(text : string, times : number) : string {
        let output = "";
        for (let idx = 0; idx < times; idx++) output += text;

        return output;
    }

    private valueNeedsQuotes(symbol : symbols.ISymbol) : boolean {
        const st = symbols.SymbolType;
        return [st.String, st.Date].indexOf(symbol.symbolType) >= 0;
    }

    visitBlock(block : symbols.BlockSymbol) {
        this.output += "{\n";

        this.scopeStack.push(block);
        for (let child of block.children) {
            child.visit(this);
        }

        this.output += this.repeatText(this.indentSpaces, block.indentLevel);
        this.output += "}\n";

        this.scopeStack.pop();
    }

    visitStatement(statement : symbols.StatementSymbol) {
        const indentLevel = this.findIndentLevel(statement);
        const scopeWhitespace = this.repeatText(this.indentSpaces, indentLevel);

        if (statement instanceof symbols.DeclarationSymbol) {
            this.output += `${scopeWhitespace}"${statement.text}": `;
            return;
        }

        if (statement instanceof symbols.AssignmentSymbol) {
            const assignment = statement as symbols.AssignmentSymbol;
            const identifier = assignment.leftHandSide.text;
            const identifierType = assignment.leftHandSide.symbolType;
            const value = assignment.rightHandSide.text.replace(/"/g, '');
            const quote = this.valueNeedsQuotes(assignment.rightHandSide) ? '"' : '';

            this.output += `${scopeWhitespace}"${identifier}": ${quote}${value}${quote}\n`;
            
            return;
        }
    }

    visitSymbolList(symbols : LinkedList<symbols.ISymbol>) : string {
        let node = symbols.head;
        while (node != null) {
            node.value.visit(this);
            node = node.next;
        }

        return this.output;
    }
}

export default class JsonCompiler {
    private symbols : LinkedList<symbols.ISymbol>;
    
    constructor(symbols : LinkedList<symbols.ISymbol>) {
        
        this.symbols = symbols;
    }

    compile(indentSpaceCount : number) : string {
        let visitor = new SymbolVisitor(indentSpaceCount);
        let output = visitor.visitSymbolList(this.symbols);

        return output;       
    }
}