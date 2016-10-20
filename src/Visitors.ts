import * as symbols from "./Symbols";

export interface IVisitor {
    visitTab(tab : symbols.TabSymbol) : void;
    visitStatement(statement : symbols.StatementSymbol) : void;
    visitComment(comment : symbols.Comment) : void;
    visitDocument(document : symbols.Document) : void; 
    visitEqualSign(equalSign: symbols.EqualSign) : void;
    visitIdentifier(identifier : symbols.Identifier) : void;
    visitType(type : symbols.Type) : void;  
}