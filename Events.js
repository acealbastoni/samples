//===========================================================================================================================
// gets Data from cache >> not found ?? gets data From Drive >>  not found ?? gets data from S3 >>  then,.. . .
// write it into Drive >> put it in cache for 6 Hours.>> Finally Log it . or return it .
//===========================================================================================================================
function getEvents(subscriberId, downloadedEventDate) {
  var key = "Event/" + subscriberId + "/" + QMedicUtilities._convertDate(downloadedEventDate) + "/EventData.json";
  var jsonEvents = null;
  //----------------------------From Cache ---------------------
  var cache = CacheService.getScriptCache();
  jsonEvents = cache.get(key);
  if (jsonEvents) {
    cache.put(key, jsonEvents, QMedicConstants.TIME_IN_CACHE); // thid Line is new .. and it is Experamental
    putAsJsonInDrive_(subscriberId, downloadedEventDate, jsonEvents);
    Logger.log("From Cache Service : "+key);
    console.log("From Cache Service : "+key);
    return JSON.parse(jsonEvents);
  }
  //-----------------------------From Drive ---------------------
  jsonEvents = getJsonEventsFromDrive_(key);
  if (jsonEvents) {
    console.log("From Drive : "+key);
    Logger.log("From Drive : "+key);
    try{cache.put(key, jsonEvents, QMedicConstants.TIME_IN_CACHE);}catch(e){}
    return JSON.parse(jsonEvents);
  }
  //---------------------------- From S3 ----------------------
  var s3Client = QMedicS3API.getInstance(QMedicConstants.AWS_KEY, QMedicConstants.AWS_SECRET);
  jsonEvents = s3Client.readEventsFromS3(key);
  try{cache.put(key, jsonEvents, QMedicConstants.TIME_IN_CACHE);}catch(e){}
  putAsJsonInDrive_(subscriberId, downloadedEventDate, jsonEvents);
  Logger.log("From S3  : "+key);
  console.log("From S3  : "+key);
  return JSON.parse(jsonEvents);
}
// very Important Method , it is used by another project. Dont remove it.
function put_in_QMedicEvents_ScriptCache(key, value)
{
  var cache = CacheService.getScriptCache();
  try{ cache.put(key, value, QMedicConstants.TIME_IN_CACHE);} catch(e){}
}