function updateInSheet(subscriberID,date,anomalyObject){
  var year_mapTo_SpreadSheetID= date.getYear();
  var sheetName = (date.getMonth() + 1).toString();
  var sheet = SpreadsheetApp.openById(spreadsheet_IDs[year_mapTo_SpreadSheetID]).getSheetByName(sheetName);
  date= QMedicUtilities._convertDate(date);
  var header = sheet.getDataRange().getValues()[0];
  var dateColumnNumber= header.indexOf(JSON.stringify(date))+1;
  sheet.getRange(subscriberID, dateColumnNumber).setValue(anomalyObject);             
}
