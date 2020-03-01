function myFunctioreterrten() {
  var jse =  getEvents(996,new Date("2019/11/13"));
  Logger.log(jse);
  

return;
  var subscriberId =6000 ;
  var  date = new Date();
  var jsonEvent = "Mohammd";
  var key = "Event/" + subscriberId + "/" + _convertDate(date) + "/EventData.json";
  
  var start = new Date().getTime();
  //---------------------------------------------------
  for(var i = 0 ; i<10; i++){
    
    DriveApp.getFileById('1JD3rc1uA2kYcvApEPVhY6nzY2-4mLcdq').setContent("Mohamme");
    
    
  }
  //----------------------------------------------------
  var ExecutionTime = (new Date().getTime()) - start;
  Logger.log(ExecutionTime);
  
  /*var subscriberId =6000 ;
  var  date = new Date();
  var jsonEvent = {name:"Mohammed", age:27};
  putAsJsonInDrive_(subscriberId, date, jsonEvent) */
  
  //putAsJsonInDrive_(subscriberId, date, jsonEvent) 
  
}



function _convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('/');
}