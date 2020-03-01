function getColumn(date){  //date = new Date("2020/1/1");
  var sheetName = (date.getMonth() + 1).toString();
 
 var year_mapTo_SpreadSheetID= date.getYear();//
 var sheet = SpreadsheetApp.openById(spreadsheet_IDs[year_mapTo_SpreadSheetID]).getSheetByName(sheetName);//
 var values = sheet.getDataRange().getValues();
  
  var header = sheet.getDataRange().getValues()[0];
  var dateColumnNumber = header.indexOf(JSON.stringify(QMedicUtilities._convertDate(date))) + 1;
  
  var column = [];
  for (var n = 1; n < values.length; ++n) {
    var cell = values[n][dateColumnNumber - 1]; // x is the index of the column starting from 0
    column.push(cell);
  }
  var arrayOfStringifiedObjects = column.filter(function (string) { return string.length > 0; });
  var arrayOfJsonObjects = [];
  
  for each(var st in arrayOfStringifiedObjects) {
    arrayOfJsonObjects.push((JSON.parse(st))["subscriber"]["subscriberId"]);
    
  }
  Logger.log(arrayOfJsonObjects);
  return arrayOfJsonObjects;
  //DriveApp.getFileById(QMedic_ScubscriberIDs_FileID).setContent(JSON.stringify(arrayOfJsonObjects));
}


