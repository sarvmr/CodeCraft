import { LiteralBlock, DummyLiteralBlock, VariableBlock } from "./classes/ValueBlock.js";


let varCon = document.getElementById("variableContainer");

var options = ["string", "number", "boolean", "float"];
var dropdown = document.getElementById("selectType");

for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.text = options[i];
    option.value = options[i];
    dropdown.add(option);
}

var valueInput = document.getElementById("valueInput");

var textInput = document.getElementById("textInput");


//This is to check what value is selected in the dropdown
dropdown.addEventListener("change", function() {

    var selected = dropdown.value;
    switch(selected) {
        case "string":
            valueInput.type = "text";
            break;
        case "number":
            valueInput.type = "number";
            break;
        case "boolean":
            valueInput.type = "checkbox";
            break;
        case "float":
            valueInput.type = "number";
            break;
        default:
            valueInput.type = "text";
            break;
    }
})

//This checks if the text value 

function uniqueCheck(textValue) {
    let childEle = varCon.children;

    for (let i = 0; i < childEle.length; i++) {
        let textElement = childEle[i].querySelector('.text-content');
        if(textElement && textElement.textContent.trim() === textValue.trim()) {
            return true;
        }
    }
    return false;
}
//Functionality of the create button to create variables
document.getElementById("createbutton").onclick = function()  {
    if(valueInput.text == "" || textInput.text == "" || dropdown.value == "") {
        var container = document.getElementById("createvariable");
        var message = document.getElementById("error");
        if(!message) {
            var error = document.createElement("p");
            error.id = "error"
            error.textContent = "Please fill out all fields before creating the variable.";
            error.style.color = "red";


            container.appendChild(error);

            setTimeout(function() {
                container.removeChild(error);
            }, 3000)
        }
    } else {
        let variableBlock;
        if(!uniqueCheck(textInput.value)) {
            if(dropdown.value == "boolean") 
            {
                variableBlock = new VariableBlock(dropdown.value, textInput.value, valueInput.checked, true);
            }
            else
            {
                variableBlock = new VariableBlock(dropdown.value, textInput.value, valueInput.value, true);
            }
            varCon.appendChild(variableBlock.element)

        } else {
            var error = document.createElement("p");
            error.id = "error"
            error.textContent = "Please fill out all fields before creating the variable.";
            error.style.color = "red";
        }

        

    }
}