import * as symbols from "./Symbols"
import * as adt from "./LinkedList"

export class SemanticAnalyzer {
    public analyze(symbolList : adt.LinkedList<symbols.ISymbol>) {
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

        if (lhs.type.symbolType != rhs.symbolType)
        {
            let valueType = symbols.SymbolType[rhs.symbolType];
            let identifierType = symbols.SymbolType[lhs.type.symbolType];

            let message = `Assignment error: Expected value type of ${valueType} but ${lhs.text} is of type ${identifierType}`;
            throw new Error(message);
        }
    }
}