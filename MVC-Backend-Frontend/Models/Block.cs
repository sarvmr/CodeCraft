using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_Backend_Frontend.Models
{
    public class Block {
        public string? type { get; set; } // variable, function, control (scope), logic, value
        // variable = assignment
        // control = scope
        // logic = logic + equality
        // value = expression + literals

        public string? instruction { get; set; } // only has print, if, while

        public Block? input { get; set; } // logic, values, variables, and chains

        public int? parent { get; set; }


        // VARIABLE BLOCKS
        public string? name { get; set; } // must be assigned
        
        
        // VALUE BLOCKS
        public string? field { get; set; } // NUM, TEXT, OP, VAR, print

        public string? text { get; set; } // string literal

        public int? num { get; set; } // int literal

        public bool? boolean { get; set; } // bool literal

        public float? float_num { get; set; } // float literal

        // add float
        // add boolean

        // OPERATOR BLOCKS
        public string? operation { get; set; } // + - * /, = += -= *= /=
                                               // add, subtract, multiply, divide
                                               // assign, assign_add, assign_subtract, assign_multiply, assign_divide

        public string? logic { get; set; } // != == >= <= > < not and or
                                           // NE EQ GE LE GT LT NOT AND OR

        public Block? A { get; set; } // left operation value [a] + b

        public Block? B { get; set; } // right operation value a + [b]


        // CONTROL BLOCKS
        public List<Block>? children { get; set; } // list of function blocks for control, do
    }
}