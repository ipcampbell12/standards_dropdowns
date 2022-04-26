//global variables 
var ss = SpreadsheetApp.getActiveSpreadsheet();
var kinder = ss.getSheetByName("Kinder");
var first = ss.getSheetByName("1st Grade");
var second = ss.getSheetByName("2nd Grade");
var third = ss.getSheetByName("3rd Grade");
var fourth = ss.getSheetByName("4th Grade");
var fifth = ss.getSheetByName("5th Grade");
var sheets = [kinder, first, second, third, fourth, fifth];

var standards = "Standards";
var firstLevelRow = 4;
var secondLevelRow = 5;
var thirdLevelRow = 6;


var ws = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
var wsDdOptions = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(standards);
var options = wsDdOptions.getRange(2, 1, wsDdOptions.getLastRow() - 1, 3).getValues();


function onEdit(activeCell) {


  var activeCell = ws.getActiveCell();
  //cell that was just modified 
  var val = activeCell.getValue();
  var r = activeCell.getRow();
  var c = activeCell.getColumn();
  var wsName = activeCell.getSheet().getName();
  if (r === firstLevelRow && c > 5) {
    applyFirstLevelValidation(val, c);
  } else if (r === secondLevelRow && c > 5) {
    applySecondLevelValidation(val, c);
    showToast();
  }
}


function applyFirstLevelValidation(val, c) {
  if (val === "") {
    ws.getRange(secondLevelRow, c).clearContent();
    ws.getRange(secondLevelRow, c).clearDataValidations();
    ws.getRange(thirdLevelRow, c).clearContent();
    ws.getRange(thirdLevelRow, c).clearDataValidations();
  } else if (val === "No standard") {
    ws.deleteColumn(c);
  } else if (val === "Add standard") {
    ws.insertColumnAfter(c);
    ws.getRange(firstLevelRow, c).clearContent();
  } else { //only run this if cell is not empty, otherwise remove validations
    ws.getRange(secondLevelRow, c).clearContent();
    ws.getRange(secondLevelRow, c).clearDataValidations();
    ws.getRange(thirdLevelRow, c).clearContent();
    ws.getRange(thirdLevelRow, c).clearDataValidations();
    //only change value if edit was in correct worksheet, first column and is not in first row
    var filteredOptions = options.filter(function (o) { return o[0] === val }); //filter if matches value in first column
    var listToApply = filteredOptions.map(function (o) { return o[1] });//only take values from second column on tab   
    var cell = ws.getRange(secondLevelRow, c);
    applyValidationToCell(listToApply, cell);
  }

}

function applySecondLevelValidation(val, c) {
  if (val === "") {
    ws.getRange(thirdLevelRow, c).clearContent();
    ws.getRange(thirdLevelRow, c).clearDataValidations();
  } else { //only run this if cell is not empty, otherwise remove validations
    ws.getRange(thirdLevelRow, c).clearContent();
    var firstLevelColValue = ws.getRange(firstLevelRow, c).getValue();
    var filteredOptions = options.filter(function (o) { return o[0] === firstLevelColValue && o[1] === val });
    var listToApply = filteredOptions.map(function (o) { return o[2] });
    var cell = ws.getRange(thirdLevelRow, c);
    applyValidationToCell(listToApply, cell);
  }

}


//general function for creating data validations
function applyValidationToCell(list, cell) {

  var rule = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(list)
    .setAllowInvalid(false) //reject input
    .build();

  cell.setDataValidation(rule);

}


function showToast() {
  var toastMessage = "When adding any post-assessment standards to your grade level's tab, consider adding the same standards for the pre-assessment."
  SpreadsheetApp.getActiveSpreadsheet().toast(toastMessage, "💡", -1);

}

function showToast2() {
  var toastMessage = "If you need to add an additional, be sure to add in the middle of the range, not the end. This way the formulas will update."
  SpreadsheetApp.getActiveSpreadsheet().toast(toastMessage, "💡", -1);

}

function onEdit2() {
  //get row 
  var ws = ss.getActiveSheet();
  var rangeT = ws.getRange("B2");
  var valT = rangeT.getValue();
  var lr = ws.getLastRow();
  var nameRange = ws.getRange(1, 3, lr, 1).getValues();

  var nr = [];

  //flatten 2d array xP
  for (var i = 0; i < nameRange.length; i++) {
    for (var j = 0; j < nameRange[i].length; j++) {
      nr.push(nameRange[i][j]);
    }
  }
  var row = nr.indexOf(valT) + 1;


  //get column
  var ws = ss.getActiveSheet();
  var rangeM = ws.getRange("C2");
  var valM = rangeM.getValue();
  var col = ss.getRangeByName(valM).getColumn();

  Logger.log(row);
  Logger.log(col);

  ws.getRange(row + 2, col + 12).activate();

  rangeT.clearContent();
  rangeM.clearContent();
}


//Made an edit

var change = 'change'