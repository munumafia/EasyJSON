import * as symbols from "./Symbols";

export interface IVisitor {
    visitBlock(block : symbols.BlockSymbol) : void;
    visitTab(tab : symbols.TabSymbol) : void;
    visitStatement(statement : symbols.StatementSymbol) : void;
    visitComment(comment : symbols.Comment) : void;
    visitDocument(document : symbols.Document) : void; 
    visitEqualSign(equalSign: symbols.EqualSign) : void;
    visitIdentifier(identifier : symbols.Identifier) : void;
    visitType(type : symbols.Type) : void;  
}

export abstract class Visitor implements IVisitor {
    public visitBlock(block: symbols.BlockSymbol) {
        // Do nothing
    }

    public visitTab(tab: symbols.TabSymbol) {
        // Do nothing
    }

    public visitStatement(statement : symbols.StatementSymbol) {
        // Do nothing
    }

    public visitComment(comment : symbols.Comment) {
        // Do nothing
    }

    public visitDocument(document : symbols.Document) {
        // Do nothing
    }

    public visitEqualSign(equalSign : symbols.EqualSign) {
        // Do nothing
    }

    public visitIdentifier(identifier : symbols.Identifier) {
        // Do nothing
    }

    public visitType(type : symbols.Type) {
        // Do nothing
    }
} 