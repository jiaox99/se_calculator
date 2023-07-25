/* Parse C++ bitmask enums*/
%lex

COMMENTS \/\*([^\*]|(\*)*[^\*/])*(\*)*\*\/

%%
\s+                     /* skip whitespace*/
{COMMENTS}              /* skip comments*/
"enum"                  return "K_Enum"
[+-]?[0-9]+\b           return "C_Number";
[a-zA-Z0-9_]+           return "V_NAME";
"="                     return "O_Equal";
","                     return "O_Comma";
"{"                     return "O_OpenBrace";
"}"                     return "O_CloseBrace";
<<EOF>>                 return "EOF";
/lex

%%


BitmaskDefinition
    :  K_Enum V_NAME O_OpenBrace EnumList O_CloseBrace
        {
            var keys = [];
            var values = [];
            for (var enumItem of $3) {
                keys.push(enumItem[0]);
                values.push(enumItem[1]);
            }
            var result = {
                name: $2,
                keys: keys,
                values: values
            };
            return result;
        }
    ;


EnumList
    :  EnumItem
        {
            $$ = [$1];
        }
    |  EnumList O_Comma EnumItem
        {
            $1.push($3);
            $$ = $1;
        }
    ;

EnumItem
    :  V_NAME O_Equal C_Number
    ;

%%