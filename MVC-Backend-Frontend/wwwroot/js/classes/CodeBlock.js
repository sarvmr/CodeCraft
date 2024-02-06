import { allowDrop, drop, drag, varDrop, varLitDrop } from "../drag_drop.js";

const LEFTSIDE_ERROR = "The block you are trying to place does not have a valid block to the left of it<br> Blocks that can be placed to the left of this block are:<br><br>";

const RIGHTSIDE_ERROR = "The block you are trying to place does not have a valid block to the right of it<br> Blocks that can be placed to the right of this block are:<br><br>";

const SCOPE_ERROR = "You cannot drag a scope block into its own scope";

const ELSE_ELIF_ERROR = "You cannot drag an else or elif block into a slot that does not have an if or elif block above it";

const SCOPE_ERROR_2 = "Scope blocks must be the first block in a line";

const LEFT_SIDE_MUST_BE_BLANK_ERROR = "The left side of this block must be blank";

class CodeBlock 
{
    static blockTypes = 
    [
        "scope",       // if, else, elif, while
        "function",     // user defined functions, built-in functions
        "assignment",   // =, +=, -=, *=, /=
        "expression",   // +, -, *, /, %
        "equality",     // ==, !=, <, >, <=, >=
        "logic",        // ||, &&
        "special"       // input, return
    ]

    constructor(blockType, subtype, element = null) 
    {
        this.subType = subtype;

        if (CodeBlock.blockTypes.includes(blockType)) 
        {
            this.blockType = blockType;
        }
        else 
        {
            throw new Error("Invalid block type");
        }

        if(element != null)
        {
            this.element = element;
            this.leftBar = element.children[0];
            this.rightBar = element.children[element.children.length - 1];
            return;
        }

        this.element = document.createElement("div");
        this.element.className = "code-block";
        this.element.dataset.blockType = blockType;
        this.element.dataset.subType = subtype;
        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});
        
        //generate a random id for the block
        this.element.id = blockType + "-" + subtype + "-" + Math.floor(Math.random() * 1000000);

        while(document.getElementById(this.element.id) != null)
        {
            this.element.id = blockType + "-" + subtype + "-" + Math.floor(Math.random() * 1000000);
        }
    }

    checkNeighbors(slot, goodLeftSide, goodRightSide)
    {
        if(slot.previousElementSibling != null && goodLeftSide.includes(slot.previousElementSibling.dataset.blockType))
        {
            return CodeBlock.checkRightSide(slot, goodRightSide);
        }
        else if(slot.previousElementSibling == null && goodLeftSide.includes(null))
        {
            return CodeBlock.checkRightSide(slot, goodRightSide);
        }
        else
        {
            if(goodLeftSide.length == 1 && goodLeftSide[0] == null)
            {
                throw new Error(LEFT_SIDE_MUST_BE_BLANK_ERROR);
                return false;
            }

            throw new Error(LEFTSIDE_ERROR + goodLeftSide);
            return false;
        }

    }

    static checkRightSide(slot, goodRightSide)
    {
        if(slot.nextElementSibling == null)
        {
            return true;
        }
        else if(slot.nextElementSibling != null && goodRightSide.includes(slot.nextElementSibling.dataset.blockType))
        {
            return true;
        }
        else
        {
            throw new Error(RIGHTSIDE_ERROR + goodRightSide);
            return false;
        }
    }

    addVarLit()
    {
        let varLit = document.createElement("div");
        varLit.className = "varlit";
        varLit.addEventListener("dragover", function(event){allowDrop(event)});
        varLit.addEventListener("drop", function(event){varLitDrop(event)});
        this.element.appendChild(varLit);

        
    }

    addVar()
    {
        let varDiv = document.createElement("div");
        varDiv.className = "var";
        varDiv.addEventListener("dragover", function(event){allowDrop(event)});
        varDiv.addEventListener("drop", function(event){varLitDrop(event)});
        this.element.appendChild(varDiv);
    }

    addExpression(string)
    {
        let expressionElement = document.createElement("p");
        expressionElement.className = "expression";
        expressionElement.innerText = string;
        this.element.appendChild(expressionElement);
    }
}



export class ScopeBlock extends CodeBlock
{
    static subTypes = 
    [
        "if",
        "elif",
        "else",
        "while"
    ]

    static goodLeftSide =
    [
        null
    ]

    static goodRightSide =
    [
        null,
        "equality"
    ]

    constructor(subType, element = null)
    {
        if (!ScopeBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }
        super("scope", subType, element);

        if(element != null)
        {
            return;
        }

        
        if(subType == "else")
        {
            this.element.className += " else";
        }
        else
        {
            this.element.className += " scope-block";

        }

        this.element.className += " threequarters"

        this.addExpression(subType.toUpperCase());
    }

    hasValidNeighbors(slot)
    {
        // prevent dragging a scope block into its own scope
        let parentContainer = document.getElementById(this.element.id + "-scope-container");
        if(parentContainer != null && parentContainer.contains(slot))
        {
            throw new Error(SCOPE_ERROR);
            return false;
        }

        let subType = this.element.dataset.subType;

        if(subType == "elif" || subType == "else")
        {
            let currentLine = slot.parentElement;
            let previousLine = currentLine.previousElementSibling;
            if(previousLine == null || previousLine.className != "scope-container")
            {
                throw new Error(ELSE_ELIF_ERROR);
                return false;
            }
            else
            {
                let ppLine = previousLine.previousElementSibling;
                let firstBlock = ppLine.children[0];

                if(!(firstBlock.dataset.subType == "if" || firstBlock.dataset.subType == "elif"))
                {
                    throw new Error(ELSE_ELIF_ERROR);
                    return false;
                }
            }
        }

        if(this.element.parentElement != null && this.element.parentElement.contains(slot))
        {
            throw new Error(SCOPE_ERROR_2);
            return false;
        }
        
        return this.checkNeighbors(slot, ScopeBlock.goodLeftSide, ScopeBlock.goodRightSide)
    }
}

export class FunctionBlock extends CodeBlock
{
    static subTypes =
    [
        "print"
    ]

    static goodLeftSide =
    [
        null
    ]

    static goodRightSide 
    [
        null
    ]
    

    constructor(subType, element = null)
    {
        if (!FunctionBlock.subTypes.includes(subType))
        {
            throw new Error("Invalid sub type");
        }

        super("function" , subType, element);

        if(element != null)
        {
            return;
        }

        this.element.className += " function-block";

        if(subType == "print")
        {
            this.addExpression("Print");
        }

        this.addVarLit();
        //this.addVar();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, FunctionBlock.goodLeftSide, FunctionBlock.goodRightSide)
    }
}


export class AssignmentBlock extends CodeBlock
{
    static subTypes =
    [
        "=",
        "+=",
        "-=",
        "*=",
        "/="
    ]

    static goodLeftSide =
    [
        null
    ]

    static goodRightSide =
    [
        "expression",
        null
    ]

    constructor(subType, element = null)
    {
        if (!AssignmentBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("assignment", subType, element);

        if(element != null)
        {
            return;
        }

        
        this.element.className += " assignment-block";

        this.addVar();
        this.addExpression(subType);
        this.addVarLit();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, AssignmentBlock.goodLeftSide, AssignmentBlock.goodRightSide);
    }
}

export class ExpressionBlock extends CodeBlock
{
    static subTypes =
    [
        "+",
        "-",
        "*",
        "/",
        "%"
    ]

    static goodLeftSide =
    [
        "expression",
        "assignment",
    ]

    static goodRightSide =
    [
        "expression",
        null
    ]


    constructor(subType, element = null)
    {
        if (!ExpressionBlock.subTypes.includes(subType))
        {
            throw new Error("Invalid sub type");
        }

        super("expression", subType, element);

        if(element != null)
        {
            return;
        }

        this.element.className += " expression-block threequarters";

        this.addExpression(subType);
        this.addVarLit();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, ExpressionBlock.goodLeftSide, ExpressionBlock.goodRightSide);
    }
}


export class EqualityBlock extends CodeBlock
{
    static subTypes =
    [
        "single",
        "==",
        "!=",
        "<",
        ">",
        "<=",
        ">="
    ]

    static goodLeftSide =
    [
        "logic",
        "scope"
    ]

    static goodRightSide =
    [
        "logic",
        null
    ]

    constructor(subType, element = null)
    {
        if (!EqualityBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("equality", subType, element);

        if(element != null)
        {   
            return;
        }

        this.element.className += " equality-block";

        this.addVarLit();

        if(subType != "single")
        {
            this.addExpression(subType);
            this.addVarLit();
        }
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, EqualityBlock.goodLeftSide, EqualityBlock.goodRightSide);
    }
}

export class LogicBlock extends CodeBlock
{
    static subTypes =
    [
        "or",
        "and"
    ]

    static goodLeftSide =
    [
        "equality"
    ]

    static goodRightSide =
    [
        "equality",
        null
    ]

    constructor(subType, element = null)
    {
        if (!LogicBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("logic", subType, element);

        if(element != null)
        {
            return;
        }

        this.element.className += " logic-block threequarters";

        this.addExpression(subType.toUpperCase());
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, LogicBlock.goodLeftSide, LogicBlock.goodRightSide);
    }
}

export class CodeSlot
{
    constructor()
    {
        this.element = document.createElement("div");
        this.element.className = "code-block-slot";
        this.element.addEventListener("dragover", function(event){allowDrop(event)});
        this.element.addEventListener("drop", function(event){drop(event)});
    }

    
}

export function isNullOrEmpty(slot)
{
  if(slot == null || slot.className == "code-block-slot")
  {
    return true;
  }

  return false;
}

