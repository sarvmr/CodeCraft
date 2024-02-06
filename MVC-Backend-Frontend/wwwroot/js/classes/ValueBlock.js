import { drag, allowDrop} from "../drag_drop.js";

export class DummyLiteralBlock
{

    static subTypes = 
    [
        "string",
        "number",
        "boolean",
        "float"
    ]

    constructor(type)
    {
        if (!DummyLiteralBlock.subTypes.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        this.element = document.createElement("div");
        this.element.id = "dummy_literal" + type;
        if(document.getElementById(this.element.id) != null)
        {
            throw new Error("Duplicate id for dummy literal block, only one dummy literal block of each type is allowed");
        }
        this.element.className = "dummy lit";
        this.element.dataset.blockType = "dummy_literal";
        this.element.dataset.subType = type;

        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});

        let typeLabel = document.createElement("p");
        typeLabel.className = "type-label";
        typeLabel.innerText = type;

        this.element.appendChild(typeLabel);
    }

}

export class LiteralBlock
{
    static subTypes = 
    [
        "string",
        "number",
        "boolean",
        "float"
    ]

    constructor(type, element = null)
    {
        if (!LiteralBlock.subTypes.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        if(element != null)
        {
            this.element = element;

            return;
        }

        this.element = document.createElement("div");
        //generate random id for the element
        this.element.id =  "literal-" + type + "-" + Math.floor(Math.random() * 1000000);

        while(document.getElementById(this.element.id) != null)
        {
            this.element.id =   "literal-" + type + "-" + Math.floor(Math.random() * 1000000);
        }

        this.element.className = "literal-block value";
        this.element.dataset.blockType = "literal";
        this.element.dataset.subType = type;
        this.element.setAttribute("draggable", "true");

        let valueInput = null;

        switch(type)
        {
            case "string":
                valueInput = getStringInput();
                break;
            case "number":
                valueInput = getNumberInput();
                break;
            case "boolean":
                valueInput = getBooleanInput();
                break;
            case "float":
                valueInput = getFloatInput();
                break;
        }

        this.element.appendChild(valueInput);

    }


}


export class VariableBlock
{
    constructor(type, name, value = null, global = false)
    {
        if (!LiteralBlock.subTypes.includes(type))
        {
            
            throw new Error("Invalid sub type");
        }

        this.element = document.createElement("div");
        
        this.element.className += global ? "variable-block value global" 
                                         : "variable-block value";

        //generate random id for the element
        this.element.id =  "variable-" + type + "-" + Math.floor(Math.random() * 1000000);

        while(document.getElementById(this.element.id) != null)
        {
            this.element.id =   "variable-" + type + "-" + Math.floor(Math.random() * 1000000);
        }

        this.element.dataset.blockType = "variable";
        this.element.dataset.name = name; 
        this.element.dataset.subType = type;
        
        

        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});

        let variableName = document.createElement("p");
        variableName.className = "variable-name";
        variableName.innerText = type + " - " + name;



        this.element.appendChild(variableName);
        

        if(value != null)
        {
            let valueInput = null;

            switch(type)
            {
                case "string":
                    valueInput = getStringInput();
                    valueInput.value = value;
                    valueInput.size = valueInput.value.length;
                    break;
                case "number":
                    valueInput = getNumberInput();
                    valueInput.value = value;
                    valueInput.style.width = (valueInput.value.length + 4) + "ch";
                    break;
                case "boolean":
                    valueInput = getBooleanInput();
                    valueInput.checked = value;
                    break;
                case "float":
                    valueInput = getFloatInput();
                    valueInput.value = value;
                    valueInput.style.width = (valueInput.value.length + 5) + "ch";
                    break;
            }

            
            this.element.appendChild(valueInput);
        }
        
    }
}

export class ArrayBlock extends VariableBlock
{
    constructor(type, name, size)
    {
        super(type, name, null);
        this.element.dataset.blockType = "array";
        this.element.className = "array-block";

        
        let valueInput = getNumberInput();
        valueInput.value = size;
        valueInput.style.width = (valueInput.value.length + 4) + "ch";
        this.element.appendChild(valueInput);
    }
}

function getNumberInput()
{
    let input = document.createElement("input");
    input.type = "number";
    input.className = "number-input";
    input.value = 0;
    input.step = "1";
    input.placeholder = "0";
    input.style.width = "6ch";
    input.addEventListener('input', function (event)
    {
        let parsed = parseInt(this.value);
        if(isNaN(parsed))
        {
            this.value = 0;
        }
        else
        {
            this.value = parsed;
        }

        this.style.width = (this.value.length + 4) + "ch";
    });
    return input;
}

function getBooleanInput()
{
    let input = document.createElement("input");
    input.type = "checkbox";
    input.className = "boolean-input";
    input.checked = true;
    return input;
}

function getStringInput()
{
    let input = document.createElement("input");
    input.type = "text";
    input.className = "string-input";
    input.size = 1;
    input.addEventListener('input', function (event) 
    {
        this.size = this.value.length;
    });
    return input;
}

function getFloatInput()
{
    let input = document.createElement("input");
    input.type = "number";
    input.className = "float-input";
    input.step = "0.1";
    input.placeholder = "0.0";
    input.style.width = "6ch";
    input.addEventListener('input', function (event)
    {
        this.style.width = (this.value.length + 5) + "ch";
    });
    return input;
}