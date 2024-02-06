using MVC_Backend_Frontend.Models;

namespace MVC_Backend_Frontend
{
    public class JsonBlockParser
    {
        public static string ParseBlock(Block? block)
        {
            // code is long string
            string code = "";

            // base case
            if (block == null)
            {
                return code;
            }

            // match the block type
            switch (block.type) // variable, function, control, logic, value
            {
                // add the variable name
                case "variable":
                    code += block.name;
                    break;

                // for print and assignments
                case "function":

                    // for assignment operations
                    if (block.field == "operation")
                    {
                        // get the left and right
                        string a = ParseBlock(block.A);
                        string b = ParseBlock(block.B);

                        // add the left and right values with operation
                        switch (block.operation) // assign, assign_add, assign_subtract, assign_multiply, assign_divide
                        {
                            case "assign_variable":
                                code += a + " = " + b;
                                break;
                            case "assign_add":
                                code += a + " += " + b;
                                break;
                            case "assign_subtract":
                                code += a + " -= " + b;
                                break;
                            case "assign_multiply":
                                code += a + " *= " + b;
                                break;
                            case "assign_divide":
                                code += a + " /= " + b;
                                break;
                            default: break;
                        }

                        // chain any operators
                        if (block.input != null)
                        {
                            code += ParseBlock(block.input);
                        }
                    }
                    // for print
                    else
                    {
                        // add the print input
                        code += block.instruction + "(";
                        code += ParseBlock(block.input);
                        code += ")";
                    }
                    break;

                // for value literals and math
                case "value":

                    // add the value literal
                    switch (block.field) // num, text, operation, var
                    {
                        case "num":
                            code += block.num;
                            break;
                        case "text":
                            code += "'" + block.text + "'";
                            break;
                        case "boolean":
                            code += block.boolean;
                            break;
                        case "float":
                            code += block.float_num;
                            break;

                        // for math operations
                        case "operation":

                            // get the right input
                            string a = ParseBlock(block.A);
                            string b = ParseBlock(block.B);

                            // add the right value for math
                            switch (block.operation) // add, subtract, multiply, divide, modulo
                            {
                                case "add":
                                    code += a + " + " + b;
                                    break;
                                case "subtract":
                                    code += a + " - " + b;
                                    break;
                                case "multiply":
                                    code += a + " * " + b;
                                    break;
                                case "divide":
                                    code += a + " / " + b;
                                    break;
                                case "add_chain":
                                    code += " + " + a;
                                    break;
                                case "subtract_chain":
                                    code += " - " + a;
                                    break;
                                case "multiply_chain":
                                    code += " * " + a;
                                    break;
                                case "divide_chain":
                                    code += " / " + a;
                                    break;
                                case "modulo_chain":
                                    code += " % " + a;
                                    break;
                                default: break;
                            }

                            // chain any operators
                            if (block.input != null)
                            {
                                code += ParseBlock(block.input);
                            }
                            break;

                        default: break;
                    }
                    break;

                // for scopes
                case "control": // if elif else while

                    // set parent to 0 if none
                    block.parent ??= 0;

                    // add the scope value
                    code += block.instruction + " ";

                    // chain the equality and logic input
                    if (block.instruction != "else")
                    {
                        code += ParseBlock(block.input);
                    }

                    code += ":";

                    if (block.children != null)
                    {
                        // indent every line in the scope
                        foreach (var child in block.children)
                        {
                            code += "\n";
                            child.parent = block.parent + 1;
                            for (int i = 0; i < block.parent; i++)
                            {
                                code += "    ";
                            }
                            code += "    " + ParseBlock(child);
                        }
                    }
                    break;

                // for equality and logic
                case "logic": // not_equals equals greater_equals less_equals greater less not and or

                    // chain a single condition in not
                    if (block.logic == "not")
                    {
                        code += block.logic + " ";
                        code += ParseBlock(block.input);

                        // get the left and right values in equality
                    }
                    else
                    {
                        // get left and right value for equality
                        string a = ParseBlock(block.A);
                        string b = ParseBlock(block.B);

                        // add the values for equality and logic
                        switch (block.logic) // not_equals equals greater_equals less_equals greater less not and or
                        {
                            case "single_chain":
                                code += a;
                                break;
                            case "not_equals":
                                code += a + " != " + b;
                                break;
                            case "equals":
                                code += a + " == " + b;
                                break;
                            case "greater_equals":
                                code += a + " >= " + b;
                                break;
                            case "less_equals":
                                code += a + " <= " + b;
                                break;
                            case "greater":
                                code += a + " > " + b;
                                break;
                            case "less":
                                code += a + " < " + b;
                                break;
                            case "and":
                                code += a + " and " + b;
                                break;
                            case "or":
                                code += a + " or " + b;
                                break;
                            case "not_equals_chain":
                                code += a + " != " + b;
                                break;
                            case "equals_chain":
                                code += a + " == " + b;
                                break;
                            case "greater_equals_chain":
                                code += a + " >= " + b;
                                break;
                            case "less_equals_chain":
                                code += a + " <= " + b;
                                break;
                            case "greater_chain":
                                code += a + " > " + b;
                                break;
                            case "less_chain":
                                code += a + " < " + b;
                                break;
                            case "and_chain":
                                code += " and ";
                                break;
                            case "or_chain":
                                code += " or ";
                                break;
                            default: break;
                        }

                        // chain the equality or logic conditions
                        if (block.input != null)
                        {
                            code += ParseBlock(block.input);
                        }
                    }
                    break;

                default: break;
            }

            // return the code string
            return code;
        }

        public static string ParseBlockList(BlockList blockList)
        {
            string codeResult = "";
            if (blockList != null && blockList.blocks != null)
            {
                foreach (var block in blockList.blocks)
                {
                    codeResult += ParseBlock(block) + "\n";
                }
            }

            return codeResult;
        }
    }
}