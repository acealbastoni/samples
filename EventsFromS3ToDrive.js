/*
Live Trigger .. it is Effective now it is used to get All subscribers of 
today and put them in Drive with the initial data contents of the time it accessed
so those Data will be wrong in the long term if it is not updated
*/
function getAllTodayEventsTrigger() {
  var startTime  = new Date().getTime();
  var id = getSubscriberId_(1);
  var subscriberId =(id&&(id<=3000))?--id:0 
  var downloadedDate = new Date(); downloadedDate.setHours(downloadedDate.getHours() - 6);
  while(++subscriberId<=3000){
    try{
      var jsonEvent= getEvents(subscriberId,downloadedDate);
      console.log("Success getting Subscriber : "+ subscriberId);
      
      var currTime =new Date().getTime();
      if(( currTime - startTime) > 1700000)
      {
        updateCell_(1,subscriberId);
        deleteTriggerByName("getAllTodayEventsTrigger");
        ScriptApp.newTrigger("getAllTodayEventsTrigger").timeBased().at(new Date(currTime+50000)).create();
        //start after 50 Seconed 
        return;
      }
    }
    catch(e)
    {
      var str = (e.message).toString();
      
      if(str.indexOf("NoSuchKey") !== -1){
        console.error("No Such Key : "+ subscriberId)
      }
      var now=new Date().getTime();
      if (!(str.indexOf("NoSuchKey") !== -1) ||  ((now - startTime) > 1700000)   ) {
        console.error("Limit Access Drive Or Execution TimedOut Error : "+ subscriberId)
        updateCell_(1,subscriberId);
        deleteTriggerByName("getAllTodayEventsTrigger");
        ScriptApp.newTrigger("getAllTodayEventsTrigger").timeBased().at(new Date(currTime+50000)).create();
        //start after 50 Seconed 
        return;
      }
    }
    if(subscriberId%20 ==0)
    {
      updateCell_(1,subscriberId);
      SpreadsheetApp.flush();
    }
    if(subscriberId == 3000)
    {
      updateCell_(1,1);
      deleteTriggerByName("getAllTodayEventsTrigger");
      ScriptApp.newTrigger("getAllTodayEventsTrigger").timeBased().at(new Date(currTime+50000)).create();
    }
  }
  
}


