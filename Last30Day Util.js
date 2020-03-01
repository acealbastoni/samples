function getLast30Day(yesterday, subscriberId) {
    var result = null;
    result = FromSheet_(yesterday, subscriberId);
    if (result) {
      Logger.log("Helllo from Drive")
      return result;
    }
    Logger.log("Helllo from S3");
    
    result = FromS3_(yesterday, subscriberId);
    
    return {
      activity: {"last30EveningSumsArr": result["last30EveningSumsArr"], "last30NightSumsArr": result["last30NightSumsArr"],"last30NoonSumsArr": result["last30NoonSumsArr"], "last30MoriningSumsArr": result["last30MoriningSumsArr"]},
      wear:{"last30DayRecentWearSumsArr":result["last30WearSumsArr"]}
    };
  }
  
  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  
  function FromSheet_(yesterday, subscriberId) {
    yesterday = new Date(yesterday);
    yesterday.setDate(yesterday.getDate() - 1)
    var year_mapTo_SpreadSheetID= yesterday.getYear();
    var month_As_sheetName = yesterday.getMonth()+1;
    yesterday = QMedicUtilities._convertDate(yesterday);
    
    var sheet = SpreadsheetApp.openById(spreadsheet_IDs[year_mapTo_SpreadSheetID]).getSheetByName(month_As_sheetName);
    var header = sheet.getDataRange().getValues()[0];
    var dateColumnNumber = header.indexOf(JSON.stringify(yesterday)) + 1;
    
    var stringfiedObject = null;
    Utilities.sleep(2000);
    stringfiedObject = sheet.getRange(subscriberId, dateColumnNumber).getValue();
    
    if (stringfiedObject.length > 0) {
      return JSON.parse(stringfiedObject);
    }
    return null;
  }
  
  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  
  function FromS3_(yesterday, subscriberId) {
    var end = new Date(QMedicUtilities._convertDate(yesterday));
    end.setDate(end.getDate() - 31);
    var dates = [];
    for (var start = new Date(QMedicUtilities._convertDate(yesterday)); start >= end; start.setDate(start.getDate() - 1)) {
      dates.push(QMedicUtilities._convertDate(start));
    }
    
    //2.Replace dates in the array with object "Wear Array" 
    dates.forEach(function (item, index, arr) { arr[index] = get_Wear_And_Activity_Array(customizedGetEvents_(subscriberId, item)) });
    
    //3. make a new array contains the last 30 Day Wear Sums
    /* in daetail , it is an array contains 30 element  Represent last 30 Day ,
    each element is the Summition of Wear array contains 24 Hour values, */
    var last30WearSumsArr = [];
    var last30MoriningSumsArr = [];
    var last30NoonSumsArr = [];
    var last30EveningSumsArr = [];
    var last30NightSumsArr = [];
    
    for (var counter = 0; counter < dates.length - 1; counter++) {
      var recentWearArr = getRecentWearOrActivity(dates[counter + 1]["wearArray"], dates[counter]["wearArray"]);
      var recentSum = Array.isArray(recentWearArr) ? sumArrayElements_(recentWearArr) : recentWearArr;
      last30WearSumsArr.push(recentSum);
      
      var recentActivityObject = sumActivityRecordInPeriods(getRecentWearOrActivity(dates[counter + 1]["activityArray"], dates[counter]["activityArray"]));
      
      last30MoriningSumsArr.push(recentActivityObject["MorningValue"]);
      last30NoonSumsArr.push(recentActivityObject["NoonValue"]);
      last30EveningSumsArr.push(recentActivityObject["EveningValue"]);
      last30NightSumsArr.push(recentActivityObject["NightValue"]);
    }
    /*################################################################################*/
    last30WearSumsArr.reverse();   
    last30MoriningSumsArr.reverse();
    last30NoonSumsArr.reverse();
    last30EveningSumsArr.reverse();
    last30NightSumsArr.reverse();
    return {
      "last30MoriningSumsArr": last30MoriningSumsArr, "last30NoonSumsArr": last30NoonSumsArr, "last30EveningSumsArr": last30EveningSumsArr,
      "last30NightSumsArr": last30NightSumsArr, "last30WearSumsArr": last30WearSumsArr
    };
  }
  
  function customizedGetEvents_(subscriberId, item) {
    try { return QMedicEvents.getEvents(subscriberId, item); } catch (e) { Logger.log("Error:customizedGetEvents_ no Key: " + subscriberId + "/" + item); return null; }
  }
  
  