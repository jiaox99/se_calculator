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
"<<"                    return "O_LeftShift";
<<EOF>>                 return "EOF";
/lex

%%


BitmaskDefinition
    :  K_Enum V_NAME O_OpenBrace EnumList O_CloseBrace
        {
            var keys = [];
            var values = [];
            for (var enumItem of $4) {
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
    |  EnumList EnumItem
        {
            $1.push($2);
            $$ = $1;
        }
    ;

EnumItem
    :  V_NAME O_Comma
        {
            $$ = [$1, -1];
        }
    |  V_NAME O_Equal V_NAME O_Comma
        {
            $$ = [$1, $3];
        }
    |  V_NAME O_Equal C_Number O_Comma
        {
            $$ = [$1, parseInt($3)];
        }
    |  V_NAME O_Equal C_Number O_LeftShift C_Number O_Comma
        {
            $$ = [$1, parseInt($3) << parseInt($5)];
        }
    ;