import {Token} from "./Lexer";
import {TokenType} from "./Lexer";
import * as symbols from "./Symbols"
import {Node, LinkedList} from "./LinkedList"
import {Visitor} from "./Visitors"
import {SemanticAnalyzer} from "./SemanticAnalysis"

function printList(list : LinkedList<symbols.ISymbol>) {
    let node = list.head;
    while (node != null) {
        console.log(node);
        node = node.next;
    }
}

function printSymbols(list : LinkedList<symbols.ISymbol>) {
    let node = list.head;
    while (node != null) { 
        console.log(node.value);
        node = node.next;
    }
}

class BlockVisitor extends Visitor {
    private currentBlock : symbols.BlockSymbol = null;
    private currentNode : Node<symbols.ISymbol>;
    private deepestBlock : symbols.BlockSymbol = null;
    private indentLevel : number = 0;
    private symbolList : LinkedList<symbols.ISymbol>;

    public constructor(symbolList : LinkedList<symbols.ISymbol>) {
        super();
        this.symbolList = symbolList;
    }

    private findBlockForIndentLevel(indentLevel : number) : symbols.BlockSymbol {
        //console.log(this.deepestBlock);
        
        //console.log(`Indent level: ${this.indentLevel}`);
        let block = this.deepestBlock;
        let found = null;
        
        while (block != null) {
            if (block.indentLevel == indentLevel) {
                found = block;
                break;
            }
            block = block.parent as symbols.BlockSymbol;
        }

        return found;
    }

    public visitStatement(statement : symbols.StatementSymbol) {
        if (this.currentBlock == null) {
            this.currentBlock = new symbols.BlockSymbol(
                statement.lineNumber,
                null,
                statement.position,
                ""
            );

            this.deepestBlock = this.currentBlock;
            statement.parent = this.currentBlock;
            this.currentBlock.children.push(statement);

            this.symbolList.replaceNode(new Node(this.currentBlock), this.currentNode);

            return;
        }

        let block = this.findBlockForIndentLevel(this.indentLevel);
        if (block == null) {
            let childBlock = new symbols.BlockSymbol(
                statement.lineNumber,
                this.currentBlock,
                statement.position,
                ""
            );

            childBlock.indentLevel = this.indentLevel;
            childBlock.children.push(statement);
            statement.parent = childBlock;
            this.currentBlock.children.push(childBlock);

            this.indentLevel = 0;
            this.symbolList.removeNode(this.currentNode);

            this.deepestBlock = this.deepestBlock.indentLevel < childBlock.indentLevel
                ? childBlock
                : this.deepestBlock;

            return;            
        }

        statement.parent = block;
        block.children.push(statement);
        this.currentBlock = block;
        this.symbolList.removeNode(this.currentNode);
        this.indentLevel = 0;

        this.deepestBlock = this.deepestBlock.indentLevel < block.indentLevel
            ? block
            : this.deepestBlock;
    }

    public visitSymbolList() {
        let node = this.symbolList.head;
        while (node != null) {
            this.currentNode = node;
            node.value.visit(this);
            node = node.next;
        }
    }

    public visitTab(tab : symbols.TabSymbol) {
        this.indentLevel++;
        this.symbolList.removeNode(this.currentNode);
    }
}

export class Parser {
    private document : symbols.Document;
    private tokens : Token[] = [];

    public constructor(tokens : Token[], programText : string) {
        this.tokens = tokens;
        this.document = new symbols.Document(programText);
    }

    public parse() : LinkedList<symbols.ISymbol> {
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

        this.handleIdentifiers(symbolList);
        this.handleEqualSign(symbolList);
        this.handleStatements(symbolList);
        this.handleTypeInference(symbolList);
        this.handleBlocks(symbolList);
        this.handleSemanticAnalysis(symbolList);        

        return symbolList;
    }

    private handleBlocks(symbolList : LinkedList<symbols.ISymbol>) {
        let blockVisitor = new BlockVisitor(symbolList);
        blockVisitor.visitSymbolList();
    }

    private handleEqualSign(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node != null) {
            if (node.value.symbolType !== symbols.SymbolType.EqualSign) {
                node = node.next;
                continue;
            }
                
            if (node.previous != null && node.previous.value.symbolType != symbols.SymbolType.Identifier) {
                console.log(`Expected Identifier, got ${typeof node.previous.value}`);
                node = node.next;
                continue;
            }

            if (node.next != null && !(node.next.value instanceof symbols.ValueSymbol)) {
                console.log(`Expected value, got ${typeof node.next.value}`);
                node = node.next;
                continue;
            }

            let equalSign = node.value as symbols.EqualSign;
            equalSign.leftHandSide = node.previous.value;
            equalSign.rightHandSide = node.next.value;

            symbolList.removeNode(node.previous);
            symbolList.removeNode(node.next);            

            node = node.next;
        }
        
    }

    private handleIdentifiers(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node) {
            if (node.value && node.value && node.value.symbolType !== symbols.SymbolType.Identifier) {
                node = node.next;
                continue;
            }

            let symbol = node.value as symbols.Identifier;
            if (node.next && node.next.value && node.next.value instanceof symbols.Type) {
                symbol.type = node.next.value;
                symbolList.removeNode(node.next);
            }

            node = node.next;
        } 
    }

    private handleSemanticAnalysis(symbolList : LinkedList<symbols.ISymbol>) {
        let analyzer = new SemanticAnalyzer();
        analyzer.analyze(symbolList);
    }

    private handleStatements(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node != null) {
            let symbol = node.value;

            if (symbol instanceof symbols.EqualSign) {
                let equalSign = symbol as symbols.EqualSign;
                let statement = new symbols.AssignmentSymbol(equalSign.lineNumber, null, equalSign.position, equalSign.text);
                statement.leftHandSide = equalSign.leftHandSide;
                statement.rightHandSide = equalSign.rightHandSide;

                symbolList.replaceNode(new Node(statement), node);
                node = node.next;
                
                continue;
            }

            if (symbol instanceof symbols.Identifier) {
                let statement = new symbols.DeclarationSymbol(symbol.lineNumber, null, symbol.position, symbol.text);
                symbolList.replaceNode(new Node(statement), node);
                node = node.next;
                
                continue;
            }

            node = node.next;
        }
    }

    private handleTypeInference(symbolList : LinkedList<symbols.ISymbol>) {
        let node = symbolList.head;
        while (node != null) {
            let symbol = node.value;
            if (!(symbol instanceof symbols.AssignmentSymbol)) {
                node = node.next;
                continue;
            } 
            
            let identifier = symbol.leftHandSide as symbols.Identifier;
            if (!identifier.type) identifier.type = symbols.Type.createFromValue(symbol.rightHandSide);       
        
            node = node.next;
        }
    }
}