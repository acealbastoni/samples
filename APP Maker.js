//very Important method , used by App Maker
function getAnomaly(subscriberId,date) {
  var date = new Date(date);
  var sheetName = (date.getMonth() + 1).toString();
  var year_mapTo_SpreadSheetID= date.getYear();//
  var sheet = SpreadsheetApp.openById(spreadsheet_IDs[year_mapTo_SpreadSheetID]).getSheetByName(sheetName);
  var values = sheet.getDataRange().getValues();
  var header = sheet.getDataRange().getValues()[0];
  var dateColumnNumber = header.indexOf(JSON.stringify(QMedicUtilities._convertDate(date))) + 1;
  var column = [];
  for (var n = 1; n < values.length; ++n) {
    var cell = values[n][dateColumnNumber - 1]; // x is the index of the column starting from 0
    column.push(cell);
  }
  var arrayOfStringifiedObjects = column.filter(function (string) { return string.length > 0; });
  var allContents = "";
  for each(var st in arrayOfStringifiedObjects) {
    var jsonFeed = JSON.parse(st)
    var record = jsonFeed["subscriber"]["subscriberId"] + "," +
      jsonFeed["subscriber"]["firstName"] + "," +
        jsonFeed["subscriber"]["lastName"] + "," +
          jsonFeed["subscriber"]["SalesForceAccountId"] + "," +
            jsonFeed["subscriber"]["Subscriber_Cellular_Phone_Number__c"] + "," +
              jsonFeed["subscriber"]["Subscriber_Landline_Phone_Number__c"] + "," +
                jsonFeed["wear"]["wearAnomally"] + "," +
                  jsonFeed["activity"]["activityAnomalyArray"][0] + "," +
                    jsonFeed["activity"]["activityAnomalyArray"][1] + "," +
                      jsonFeed["activity"]["activityAnomalyArray"][2] + "," +
                        jsonFeed["activity"]["activityAnomalyArray"][3] + "\n";
    allContents = allContents + record;
  }
  return allContents;
}
