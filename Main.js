function main(date, subscriberId) {
  date= new Date(date);
  date.setDate(date.getDate()+1); // new line this for set theActually  date 
  var today = new Date(date);
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1)
  var todayJsonEvent;
  var yesterdayJsonEvent;
  
  try {todayJsonEvent = QMedicEventsFromS3Only.getEvents(subscriberId, QMedicUtilities._convertDate(today)); } catch (e) {console.error(e.message+" : in today " + subscriberId); var str = (e.message).toString();if(str.indexOf("too") !== -1){return e.message;} todayJsonEvent = null; }
  try {yesterdayJsonEvent = QMedicEventsFromS3Only.getEvents(subscriberId, QMedicUtilities._convertDate(yesterday)); } catch (e) {console.error(e.message+ " : in Yesterday "+ subscriberId); var str = (e.message).toString();if(str.indexOf("too") !== -1){return;}  yesterdayJsonEvent = null; }
  
  /*  today wear and activity  */
  //  -------------------------------------
  var todayMultiTypeObject = get_Wear_And_Activity_Array(todayJsonEvent);
  var todayWearArr = todayMultiTypeObject["wearArray"]; //18
  var todayActivity = todayMultiTypeObject["activityArray"];
  //  -------------------------------------
  
  
  /*  yesterday wear and activity */
  //  ---------------------------------------------
  var yesterdayMultiTypeObject = get_Wear_And_Activity_Array(yesterdayJsonEvent);
  var yesterdayWearArr = yesterdayMultiTypeObject["wearArray"];      //returns:  [] , -1
  var yesterdayActivity = yesterdayMultiTypeObject["activityArray"]; //returns:  [] , -1, 
  //  ---------------------------------------------
  
  /*  recent today wear   */
  var recentWearArr = getRecentWearOrActivity(yesterdayWearArr, todayWearArr); // return [] or -1 
  var recentWearValue = (Array.isArray(recentWearArr)) ? sumArrayElements_(recentWearArr) : -1; // -1 or positive value 
  
  /*  recent today Activity  */
  var recentActivityArr = getRecentWearOrActivity(yesterdayActivity, todayActivity);// return [] or -1
  var period2D = sumActivityRecordInPeriods(recentActivityArr); //[[morning][noon][evening][night]]
  var todayMorningValue = period2D["MorningValue"];  // -1 or positive value
  var todayNoonValue = period2D["NoonValue"];        // -1 or positive value
  var todayEveningValue = period2D["EveningValue"];  // -1 or positive value
  var todayNightValue = period2D["NightValue"];      // -1 or positive value
  //  --------------------------------------------
  
  
  var Result = getLast30Day(yesterday, subscriberId);              //√
  
  var last30MoriningSumsArr = Result["activity"]["last30MoriningSumsArr"];
  var morningRepresentation = ((todayMorningValue >= 0) && countOfMinusOnes_(last30MoriningSumsArr) <= 15) ? getActivtiyRepresentation(todayMorningValue, last30MoriningSumsArr) : returnID_(todayMorningValue, last30MoriningSumsArr)
  
  
  
  var last30NoonSumsArr = Result["activity"]["last30NoonSumsArr"];
  var noonRepresentation = ((todayNoonValue >= 0) && countOfMinusOnes_(last30NoonSumsArr) <= 15) ? getActivtiyRepresentation(todayNoonValue, last30NoonSumsArr) : returnID_(todayNoonValue, last30NoonSumsArr);
  
  
  var last30EveningSumsArr = Result["activity"]["last30EveningSumsArr"];
  var eveningRepresentation = ((todayEveningValue >= 0) && countOfMinusOnes_(last30EveningSumsArr) <= 15) ? getActivtiyRepresentation(todayEveningValue, last30EveningSumsArr) : returnID_(todayEveningValue, last30EveningSumsArr);
  
  var last30NightSumsArr = Result["activity"]["last30NightSumsArr"];
  var nightRepresentation = ((todayNightValue >= 0) && countOfMinusOnes_(last30NightSumsArr) <= 15) ? getActivtiyRepresentation(todayNightValue, last30NightSumsArr) : returnID_(todayNightValue, last30NightSumsArr);
  
  
  
  var last30WearSumsArr = Result["wear"]["last30DayRecentWearSumsArr"];                                  //√
  var wearAnomally = ((recentWearValue >= 0) && countOfMinusOnes_(last30WearSumsArr) <= 15) ? getWearRepresentation(recentWearValue, last30WearSumsArr) : returnID_(recentWearValue, last30WearSumsArr);  //√
  
  
  var activityAnomalyArray = [morningRepresentation, noonRepresentation, eveningRepresentation, nightRepresentation];
  Logger.log("Test :  "+ yesterdayJsonEvent);
  console.log("Test :  "+ yesterdayJsonEvent);
  
  if((yesterdayJsonEvent===null) && (todayJsonEvent ===null)){
    console.error("HaHaHa From Drive Objec");
    Logger.log("HaHaHa From Drive Objec");
    var objectNotInS3 = FromSheet_(yesterday, subscriberId);
  }
  //------------------------------------
  var AnomallyData = {
    subscriber: {
      subscriberId:(todayJsonEvent || yesterdayJsonEvent) ?
      (function(todayJsonEvent,yesterdayJsonEvent){try{return todayJsonEvent?(todayJsonEvent["subscriber"]["subscriberId"]):(yesterdayJsonEvent["subscriber"]["subscriberId"])}catch(e){}})(todayJsonEvent,yesterdayJsonEvent):
      subscriberId,
      
      firstName: (todayJsonEvent ||yesterdayJsonEvent)?
      (function(todayJsonEvent,yesterdayJsonEvent){try{return todayJsonEvent["subscriber"]["SalesForceAccount"]["First_Name__c"]; }catch(e){return yesterdayJsonEvent["subscriber"]["SalesForceAccount"]["First_Name__c"]}})(todayJsonEvent,yesterdayJsonEvent):
      (function(objectNotInS3){try{return objectNotInS3["subscriber"]["firstName"];}catch(e){console.error(e);}})(objectNotInS3),
      
      lastName: (todayJsonEvent ||yesterdayJsonEvent) ?
      (function(todayJsonEvent,yesterdayJsonEvent){try{return (todayJsonEvent["subscriber"]["SalesForceAccount"]["Last_Name__c"])}catch(e){return yesterdayJsonEvent["subscriber"]["SalesForceAccount"]["Last_Name__c"];}})(todayJsonEvent,yesterdayJsonEvent):
      (function(objectNotInS3){try{return objectNotInS3["subscriber"]["lastName"];}catch(e){}})(objectNotInS3),
      
      SalesForceAccountId:  (todayJsonEvent ||yesterdayJsonEvent) ? 
      (function(todayJsonEvent,yesterdayJsonEvent){try{return (todayJsonEvent["subscriber"]["SalesForceAccount"]["Id"] );}catch(e){return yesterdayJsonEvent["subscriber"]["SalesForceAccount"]["Id"];}})(todayJsonEvent,yesterdayJsonEvent):
      (function(objectNotInS3){try{return objectNotInS3["subscriber"]["SalesForceAccountId"];}catch(e){}})(objectNotInS3),
      
      Subscriber_Cellular_Phone_Number__c: (todayJsonEvent ||yesterdayJsonEvent)? 
      (function(todayJsonEvent,yesterdayJsonEvent){var cellular;try{cellular = todayJsonEvent["subscriber"]["SalesForceAccount"]["Subscriber_Cellular_Phone_Number__c"];return cellular===null?"NA":cellular;}catch(e){}cellular= yesterdayJsonEvent["subscriber"]["SalesForceAccount"]["Subscriber_Cellular_Phone_Number__c"];return cellular===null?"NA":cellular;})
      (todayJsonEvent,yesterdayJsonEvent):
      (function(objectNotInS3){try{return objectNotInS3["subscriber"]["Subscriber_Cellular_Phone_Number__c"];}catch(e){}})(objectNotInS3),
      
      Subscriber_Landline_Phone_Number__c: (todayJsonEvent ||yesterdayJsonEvent) ?
      (function(todayJsonEvent,yesterdayJsonEvent){var landline;try{landline =todayJsonEvent["subscriber"]["SalesForceAccount"]["Subscriber_Landline_Phone_Number__c"];           return landline===null?"NA":landline; 
                                                                   }catch(e){ } landline = yesterdayJsonEvent["subscriber"]["SalesForceAccount"]["Subscriber_Landline_Phone_Number__c"];return landline===null?"NA":landline;})
      (todayJsonEvent,yesterdayJsonEvent):
      (function(objectNotInS3){try{return objectNotInS3["subscriber"]["Subscriber_Landline_Phone_Number__c"];}catch(e){}})(objectNotInS3)
    },
    wear:{ 
      todayWearRecentValue: recentWearValue,
      last30DayRecentWearSumsArr: last30WearSumsArr,
      wearAnomally: wearAnomally },
    activity:{
      todayMorningValue: todayMorningValue,
      todayNoonValue: todayNoonValue,
      todayEveningValue: todayEveningValue,
      todayNightValue: todayNightValue,
      //=======================================
      last30MoriningSumsArr: last30MoriningSumsArr,
      last30NoonSumsArr: last30NoonSumsArr,
      last30EveningSumsArr: last30EveningSumsArr,
      last30NightSumsArr: last30NightSumsArr,
      //=======================================
      activityAnomalyArray: activityAnomalyArray
    }
  };
  Utilities.sleep(2000);
  updateInSheet(subscriberId,yesterday,JSON.stringify(AnomallyData));
}
