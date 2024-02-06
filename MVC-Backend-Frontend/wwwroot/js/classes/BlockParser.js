export class BlockParser {

    // reads all the variables
    static parseVars (vars) {
        let list = [];
        
        // go through all the variables
        for (let i = 0; i < vars.length; i++) {
    
            // add them to the list
            list.push({
                "type": "function",
                "field": "operation",
                "operation": "assign_variable",
                "A": {
                    "type": "variable",
                    "name": vars[i].dataset.name
                },
                "B": this.#matchType(vars[i])
            })
        }

        // return the list of variables
        return list;
    }

    // reads every line and uses functions to chain inputs
    static parseLines(container, scoped) {

        let list = [];
    
        // filter the container
        let lines = scoped ? container.children[1].children 
                           : container.children 
        
        // get the lines in container
        lines = Array.prototype.slice.call( lines )
            .filter((x) => x.className === "line" || x.className === "scope-container");
    
        // go through all the lines
        for (let i = 0; i < lines.length; i++) {
    
            // get the blocks in line
            let blocksInLine = lines[i].getElementsByClassName("code-block");
            
            // create
            if (blocksInLine.length) {
    
                // create the object
                let block = { "type": blocksInLine[0].dataset.blockType };
    
                // add the values for the block
                switch (block["type"]) {
                    case "function":
                        
                        // print
                        block["instruction"] =  blocksInLine[0].dataset.subType;
                        this.#getValue(block, blocksInLine[0]);
                        break;
    
                    case "scope":
                        
                        // if elif else while
                        block = {"type": "control", "instruction": blocksInLine[0].dataset.subType};
    
                        // chain equality and logic blocks
                        if (blocksInLine.length > 1) {
                            this.#getInput(block, blocksInLine);
                        }
    
                        // go inside scope container
                        i++;
    
                        // get the lines inside the scope container
                        block["children"] = this.parseLines(lines[i], true);
                        break;
                    case "assignment":
                        
                        // = += -= *= /=
                        block = {"type": "function", "field": "operation"};
    
                        // match the operation block
                        let operation = blocksInLine[0].dataset.subType;
    
                        // add the operation type to the object
                        switch(operation) {
                            case "=":
                                block["operation"] = "assign_variable";
                                break;
                            case "+=":
                                block["operation"] = "assign_add";
                                break;
                            case "-=":
                                block["operation"] = "assign_subtract";
                                break;
                            case "*=":
                                block["operation"] = "assign_multiply";
                                break;
                            case "/=":
                                block["operation"] = "assign_divide";
                                break;
                            default:
                                break;
                        }
    
                        this.#getValue(block, blocksInLine[0]);
    
                        // chain math blocks
                        if (blocksInLine.length > 1) {
                            this.#getInput(block, blocksInLine);
                        }
                        break;
                    default:
                        break;
                }
    
                // add the block to the list
                list.push(block);
            }
        }

        // return the list of lines or children
        return list;
    }

    // reads the blocks in line and chains them all in an input
    static #getInput(block, line) {
    
        // use a temp variable to chain blocks
        let reference = block;
        // get the next block in the line
        let inputIndex = 1;
        // get the block type
        let type = line[inputIndex].dataset.blockType === "equality" ? "logic" : "value";
    
        // match the type
        if (type === "logic") {
            
            // go through all the blocks in the line
            while (inputIndex < line.length) {
    
                // create the object
                reference["input"] = {"type": type};
    
                // match the type of logic block
                let logic = line[inputIndex].dataset.subType;
    
                // add the logic type to the object
                switch (logic) {
                    case "single":
                        reference["input"]["logic"] = "single_chain";
                        break;
                    case "==":
                        reference["input"]["logic"] = "equals_chain";
                        break;
                    case "!=":
                        reference["input"]["logic"] = "not_equals_chain";
                        break;
                    case "<":
                        reference["input"]["logic"] = "less_chain";
                        break;
                    case ">":
                        reference["input"]["logic"] = "greater_chain";
                        break;
                    case "<=":
                        reference["input"]["logic"] = "less_equals_chain";
                        break;
                    case "<=":
                        reference["input"]["logic"] = "greater_equals_chain";
                        break; 
                    case "and":
                        reference["input"]["logic"] = "and_chain";
                        break;
                    case "or":
                        reference["input"]["logic"] = "or_chain";
                        break;
                    default:
                        break;
                }
    
                // get the left and right values
                if (reference["input"]["logic"] != "and_chain" && reference["input"]["logic"] != "or_chain") {
                    this.#getValue(reference["input"], line[inputIndex]);
                }
    
                // check the next block that was chained
                reference = reference["input"];
                inputIndex++;
            }
    
        } else {
    
            // go through all the blocks in the line
            while (inputIndex < line.length) {
    
                // create the object
                reference["input"] = {"type": type, "field": "operation"};
    
                // match the type of operation block
                let operation = line[inputIndex].dataset.subType;
    
                // add the operation type to the object
                switch (operation) {
                    case "+":
                        reference["input"]["operation"] = "add_chain";
                        break;
                    case "-":
                        reference["input"]["operation"] = "subtract_chain";
                        break;
                    case "*":
                        reference["input"]["operation"] = "multiply_chain";
                        break;
                    case "/":
                        reference["input"]["operation"] = "divide_chain";
                        break;
                    case "%":
                        reference["input"]["operation"] = "modulo_chain";
                        break;
                    default:
                        break;
                }
    
                // get the single value
                this.#getValue(reference["input"], line[inputIndex]);
    
                // check the next block that was chained
                reference = reference["input"];
                inputIndex++;
            }
        }
    }

    // parses the value inside the code block
    static #getValue(blockObject, codeBlock) {
    
        // get the type of block
        let type = blockObject["type"];
    
        // check the block if there are any values
        let input = codeBlock.getElementsByClassName('value');
    
        // add the values to the object
        if (input) {
    
            // match the inputs needed for the block
            switch (type) {
                case "function":
                    if ("operation" in blockObject) {
                        // assignment has A and B
                        blockObject["A"] = {"type": "variable", "name": input[0].dataset.name};
                        blockObject["B"] = this.#matchType(input[1]);
                    } else {
                        // print has input
                        blockObject["input"] = this.#matchType(input[0]);
                    }
                    break;
                case "value":
                    // math has A
                    blockObject["A"] = this.#matchType(input[0]);
                    break;
                case "logic":
                    if (blockObject["logic"] === "single_chain") {
                        // single has A
                        blockObject["A"] = this.#matchType(input[0]);
                    } else {
                        // logic has A and B
                        blockObject["A"] = this.#matchType(input[0]);
                        blockObject["B"] = this.#matchType(input[1]);
                    }
                    break;
                default:
                    break;
            }
        }    
    }

    // matches the type of value block and creates an object
    static #matchType(block) {

        // get the type of block
        let value = block.dataset.blockType;
    
        if (!block.classList.contains("global") && value === "variable" ) {
    
            // get the variable name
            return {"type": "variable", "name": block.dataset.name};
        } else {
    
            // match the type of value for literals and global variables
            let type = block.dataset.subType;
    
            // create the block object
            switch (type) {
                case "number":
                    return {"type": "value", 
                            "field": "num", 
                            "num": block.getElementsByClassName('number-input')[0].value};
                case "string":
                    return {"type": "value", 
                            "field": "text", 
                            "text": block.getElementsByClassName('string-input')[0].value};
                case "boolean":
                    return {"type": "value", 
                            "field": "boolean", 
                            "boolean": block.getElementsByClassName('boolean-input')[0].checked};
                case "float":
                    return {"type": "value", 
                            "field": "float", 
                            "float_num": block.getElementsByClassName('float-input')[0].value};
                default:
                    return null;
            }
        }
    }
}