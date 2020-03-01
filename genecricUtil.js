//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function get_Wear_And_Activity_Array(jsonEvent) {   //returns  [] , -1
  var wearArray = -1;
  var activityArray = -1;
  if (jsonEvent) {
    jsonEvent = ((typeof jsonEvent) === 'string') ?JSON.parse(jsonEvent):jsonEvent;
    for (var x = 0; x < jsonEvent.events.length; x++) {
      if (jsonEvent.events[x]["type"] == "ANALYSIS_WEAR_DURATION_HOURLY") {
        wearArray = jsonEvent.events[x]["value"];
      }
      if (jsonEvent.events[x]["type"] == "ANALYSIS_ACTIVITY_HOURLY_AVERAGE") {
        activityArray = jsonEvent.events[x]["value"]
      }
    }
  }
  return {"wearArray": wearArray, "activityArray": activityArray };
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function getRecentWearOrActivity(yesterday_WEAR_Array, today_WEAR_Array) {
  var The24HoursComparedArray = [];
  if (Array.isArray(yesterday_WEAR_Array) && Array.isArray(today_WEAR_Array)) {
    
    for (var i = 0; i < yesterday_WEAR_Array.length; i++) {
      The24HoursComparedArray[i] = (i < 18) ? yesterday_WEAR_Array[i + 6] : today_WEAR_Array[i - 18];
    }
    return The24HoursComparedArray; //24 hour
  }
  
  if (Array.isArray(yesterday_WEAR_Array) && typeof today_WEAR_Array == 'number') {
    
    for (var i = 6; i < yesterday_WEAR_Array.length; i++) {
      The24HoursComparedArray[i - 6] = yesterday_WEAR_Array[i]; //18 hour
    }
    return The24HoursComparedArray;
  }
  
  if (typeof yesterday_WEAR_Array == 'number' && Array.isArray(today_WEAR_Array)) {
    
    for (var i = 0; i < 6; i++) {
      The24HoursComparedArray[i] = today_WEAR_Array[i]; //6 hour
    }
    return The24HoursComparedArray;
  }
  if (typeof yesterday_WEAR_Array == 'number' && typeof today_WEAR_Array == 'number') {
    
    return -1;
  }
  Logger.log("Error in the Type of the Parameter that passed into :  getRecentWearOrActivity() Method");
  
}


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function sumActivityRecordInPeriods(recentActivity) {
  var morning = 0, noon = 0, evening = 0, night = 0;
  if (Array.isArray(recentActivity) && recentActivity.length == 24) {
    for (var i = 0; i < recentActivity.length; i++) {
      if (i < 6) {
        morning = morning + recentActivity[i]
      }
      if (i >= 6 && i < 12) {
        noon = noon + recentActivity[i]
      }
      if (i >= 12 && i < 18) {
        evening = evening + recentActivity[i]
      }
      if (i >= 18 && i < 24) {
        night = night + recentActivity[i]
      }
    }
    
    return { "MorningValue": morning, "NoonValue": noon, "EveningValue": evening, "NightValue": night };
  }
  if (Array.isArray(recentActivity) && recentActivity.length == 18) {
    night = -1;
    for (var i = 0; i < recentActivity.length; i++) {
      if (i < 6) {
        morning = morning + recentActivity[i]
      }
      if (i >= 6 && i < 12) {
        noon = noon + recentActivity[i]
      }
      if (i >= 12 && i < 18) {
        evening = evening + recentActivity[i]
      }
    }
    return { "MorningValue": morning, "NoonValue": noon, "EveningValue": evening, "NightValue": night };
  }
  if (Array.isArray(recentActivity) && recentActivity.length == 6) {
    morning = -1, noon = -1, evening = -1;
    for (var i = 0; i < recentActivity.length; i++) {
      if (i < 6) {
        night = night + recentActivity[i]
      }
    }
    return { "MorningValue": morning, "NoonValue": noon, "EveningValue": evening, "NightValue": night };
  }
  if (typeof recentActivity == 'number') {
    morning = -1; noon = -1; evening = -1; night = -1;
    return { "MorningValue": morning, "NoonValue": noon, "EveningValue": evening, "NightValue": night };
  }
}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
