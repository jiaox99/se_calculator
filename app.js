$(function(){
    initButtons();
});

var allDialogs = [];
var bitmaskDefs = {};
var bitmaskDropDowns = [];
var bitmaskParser = new bitmask.Parser();

function BitmaskDefinition(name="", keys=[], values=[])
{
    this.name = name;
    this.keys = keys;
    this.values = values;
}

function parseBitmask(content)
{
    var result = bitmaskParser.parse(content);

    console.log(result);

    return new BitmaskDefinition(result.name, result.keys, result.values);
}

function initButtons()
{
    $("#addNewExpressionBtn").button().on("click", function(event){
        createNewExpressionDialog();
    });

    $("#addNewBitmaskDefBtn").button().on("click", function(event){
        createNewBitmaskDefinitionDialog();
    });

    $("#addNewBitmaskValueBtn").button().on("click", function(event){
        createNewBitmaskValueDialog();
    });
}

function createNewExpressionDialog()
{
    var ele = $("<div title='Expression'><b>Expression:</b></div>");
    var input = $("<input />").css("width", "100%");
    var output = $("<p>The Result:</p>");
    input.on("keyup", function(e){
        if (e.which == 13)
        {
            var result = eval(input.val());
            output.html(`<p>The Result: ${result}</p>`);
        }
    });
    ele.append([input, output]);
    $("body").append(ele);
    ele.dialog()
    allDialogs.push(ele);
}

function createNewBitmaskDefinitionDialog()
{
    var ele = $(`<div title="Bitmask Definition"></div>`);
    var input = $(`<textarea rows="8" cols="28"/>`);
    var button = $(`<button>Confirm</button>`);
    button.button().on("click", function(e){
        var content = input.val();
        var def = parseBitmask(content);
        bitmaskDefs[def.name] = def;
    });
    ele.append(input, button);
    $("body").append(ele);
    ele.dialog();
    allDialogs.push(ele);
}

function createNewBitmaskValueDialog()
{
    var ele = $(`<div title="Bitmask Value"></div>`);
    var input = $(`<input />`);
    var dropdown = $(`<select />`);
    input.on("keyup", function(e){
        if (e.which == 13)
        {
            
        }
    });

    ele.append(input, dropdown);

    $("body").append(ele);
    ele.dialog();
    allDialogs.push(ele);
}