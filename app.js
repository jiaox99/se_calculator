$(function(){
    initButtons();
});

let allDialogs = [];
let bitmaskDefs = {};
let bitmaskDropDowns = [];
let bitmaskParser = new bitmask.Parser();
bitmaskDefId = 0;

class BitmaskDefinition {
    constructor(id, name = "", keys = [], values = []) {
        this.id = id;
        this.name = name;
        this.keys = keys;
        this.values = values;
    }
}

function parseBitmask(content, id)
{
    try
    {
        let result = bitmaskParser.parse(content);

        // console.log(result);
    
        return new BitmaskDefinition(id, result.name, result.keys, result.values);
    }
    catch(e)
    {
        alert(e);
        return null;
    }
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
	
	$("#addPathNormalizerBtn").button().on("click", function(event){
		createNewPathNormalizerDialog();
	});
}

function createNewExpressionDialog()
{
    let ele = $("<div title='Expression'><b>Enter the expression:</b></div>");
    let input = $(`<input placeholder="e.g. 2+3*4"/>`).css("width", "100%");
    let note = $(`<input placeholder="Any note"/>`).css("width", "100%");
    let output = $("<p>The Result:</p>");
    input.on("keyup", function(e){
        if (e.which == 13)
        {
            let result = eval(input.val());
            output.html(`<p>The Result: <br>DEC: ${result} <br>HEX: ${result.toString(16)} <br>BIN: ${result.toString(2)}</p>`);
        }
    });
    ele.append([input, note, output]);
    $("body").append(ele);
    ele.dialog()
    allDialogs.push(ele);
}

function refreshBitmaskDropdown( dropdown )
{
    let selectedIndex = dropdown.get(0).selectedIndex;
    let option = "";
    if (selectedIndex >= 0)
    {
        option = dropdown.get(0).options[selectedIndex].text;
    }
    dropdown.empty();
    let i = -1;
    for (let key in bitmaskDefs)
    {
        let opt = $("<option />").val(key).text(key);
        dropdown.append(opt);
        i++;
        if (key === option)
        {
            selectedIndex = i;
        }
    }

    dropdown.get(0).selectedIndex = selectedIndex;
}

function refreshAllBitmaskDropdowns()
{
    for (let i = 0; i < bitmaskDropDowns.length; i++)
    {
        refreshBitmaskDropdown(bitmaskDropDowns[i]);
    }
}

function createNewBitmaskDefinitionDialog()
{
    let ele = $(`<div title="Bitmask Definition"></div>`);
    let input = $(`<textarea rows="8" cols="28"/>`);
    let button = $(`<button>Confirm</button>`);
    bitmaskDefId++;
    button.button().on("click", function(e){
        let content = input.val();
        let def = parseBitmask(content, bitmaskDefId);
        if (def !== null)
        {
            if (bitmaskDefs[def.name] !== undefined && bitmaskDefs[def.name].id !== bitmaskDefId)
            {
                alert("Bitmask with the same name already exists!");
                return;
            }
            bitmaskDefs[def.name] = def;
        }
    });
    ele.append(input, button);
    $("body").append(ele);
    ele.dialog();
    allDialogs.push(ele);
}

function refreshBitmaskResult(value, defName, output)
{
    let def = bitmaskDefs[defName];
    let result = [];
    for (let i = 0; i < def.keys.length; i++)
    {
        if (value & def.values[i])
        {
            result.push(def.keys[i]);
        }
    }
    output.html(`<p>The result:<br>${result.join(",")}</p>`)
}

function createNewBitmaskValueDialog()
{
    let ele = $(`<div title="Bitmask Value"></div>`);
    let input = $(`<input />`).css("width", "60px");
    let dropdown = $(`<select />`);
    let output = $(`<p />`);
    dropdown.on("change", function(e){
        refreshBitmaskResult(parseInt(input.val()), dropdown.val(), output);
    });
    refreshBitmaskDropdown(dropdown);
    input.on("keyup", function(e){
        if (e.which == 13)
        {
            refreshBitmaskResult(parseInt(input.val()), dropdown.val(), output);
        }
    });

    bitmaskDropDowns.push(dropdown);
    ele.append(input, dropdown, output);

    $("body").append(ele);
    ele.dialog();
    allDialogs.push(ele);
}

function createNewPathNormalizerDialog()
{
	let ele = $("<div title='Normalizer'><b>Enter the path:</b></div>");
    let input = $(`<input placeholder="C:\\tempfiles/abc/def\\html"/>`).css("width", "100%");
    let note = $(`<input placeholder="Any note"/>`).css("width", "100%");
    let output = $("<p>The Result:</p>");
    input.on("keyup", function(e){
        if (e.which == 13)
        {
            let result = input.val();
			let spReg = /[\/|\\]+/g
            output.html(`<p>The Result: <br>Win: ${result.replace(spReg, "\\")} <br>Win2: ${result.replace(spReg, "\\\\")} <br>Linux: ${result.replace(spReg, "/")}</p>`);
        }
    });
    ele.append([input, note, output]);
    $("body").append(ele);
    ele.dialog()
    allDialogs.push(ele);
}