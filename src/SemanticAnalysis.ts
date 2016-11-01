import * as symbols from "./Symbols"
import * as adt from "./LinkedList"
import mixin from "./Mixin"
import {Visitor} from "./Visitors"

class SymbolTable<TSymbolType> {
    private symbolTable : { [id : string] : TSymbolType } = {};

    public addSymbol(symbol : TSymbolType, name : string) : void {
        if (this.containsSymbol(name)) {
            let message = `A symbol with the name "${name}" already exists`;
            throw new Error(message);
        }
        
        this.symbolTable[name] = symbol;
    }

    public containsSymbol(name : string) : boolean {
        return !! this.symbolTable[name];
    }

    public getSymbol(name : string) : TSymbolType {
        if (!this.containsSymbol(name)) {
            let message = `A symbol with the name "${name}" is not in the dictionary"`;
            throw new Error(message);
        }

        return this.symbolTable[name];
    }
}

type BlockWithSymbolTable = SymbolTable<symbols.ISymbol> & symbols.BlockSymbol; 

class BlockVisitor extends Visitor {
    private blockStack : BlockWithSymbolTable[] = [];

    visitBlock(block : symbols.BlockSymbol) {
        let mixed = mixin(new SymbolTable<symbols.StatementSymbol>(), block);
        this.blockStack.push(mixed);

        for (let child of mixed.children) {
            child.visit(this);
        }

        this.blockStack.pop();
    }

    visitStatement(statement : symbols.StatementSymbol) {
        let currentBlock = this.blockStack[this.blockStack.length-1];
        let symbol : symbols.ISymbol;

        if (statement instanceof symbols.AssignmentSymbol) {
            let assignment = statement as symbols.AssignmentSymbol;
            symbol = assignment.leftHandSide;
        } else if (statement instanceof symbols.DeclarationSymbol) {
            let declaration = statement as symbols.DeclarationSymbol;
            // This is fucked, we should be able to grab the identifier used as part of the declaration statement
            // A declaration statement should have an identifier and then an optional type
            symbol = declaration;
        } else {
            throw new Error("Encountered unknown statement type");
        }

        if (currentBlock.containsSymbol(symbol.text)) {
            let message = `An identifer named "${symbol.text} already exists in the current scope on line ${symbol.lineNumber}`;
            throw new Error(message);
        }

        currentBlock.addSymbol(symbol, symbol.text);
    }

    visitSymbolList(list : adt.LinkedList<symbols.ISymbol>) {
        let node = list.head;
        while (node != null) {
            node.value.visit(this);
            node = node.next;
        }
    }
}

export class SemanticAnalyzer {
    public analyze(symbolList : adt.LinkedList<symbols.ISymbol>) {
        let visitor = new BlockVisitor();
        visitor.visitSymbolList(symbolList);
        
        let node = symbolList.head;
        while (node != null) {
            let value = node.value;
            if (value instanceof symbols.AssignmentSymbol) {
                this.analyzeAssignmentSymbol(value as symbols.AssignmentSymbol);
                node = node.next;
                continue;
            }

            node = node.next;
        }        
    }

    private analyzeAssignmentSymbol(symbol : symbols.AssignmentSymbol) {
        let lhs = symbol.leftHandSide as symbols.Identifier;
        let rhs = symbol.rightHandSide as symbols.ValueSymbol;

        if (lhs.type.underlyingType != rhs.symbolType)
        {
            let valueType = symbols.SymbolType[rhs.symbolType];
            let identifierType = symbols.SymbolType[lhs.type.underlyingType];

            let message = `Assignment error: Expected value type of ${valueType} but ${lhs.text} value is of type ${identifierType}`;
            throw new Error(message);
        }
    }
}