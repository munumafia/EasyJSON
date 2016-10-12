declare function require(name:string);

let fs = require('fs');

import {Lexer} from "./Lexer";
import {Parser} from "./Parser";

fs.readFile("program.txt", "utf8", (err, data) => {
    console.log(data);
    
    let lexer = new Lexer();
    let tokens = lexer.lex(data);
    console.log(tokens);

    let parser = new Parser(tokens, data);
    let document = parser.parse();
    console.log(document);
});