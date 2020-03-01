function add_NewSubscriberIDs_OfToday_To_TheExistingArrayOfSubscribers_InTheFile_Trigger() {
  var today = new Date();
  today.setHours(today.getHours() - 6);
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  
  var SP_Objet = JSON.parse(DriveApp.getFileById(QMedic_ScubscriberIDs_FileID).getBlob().getDataAsString());
  //SP_Objet.length=500;
  //PropertiesService.getUserProperties().setProperty("index",SP_Objet.indexOf(16));return;
  //Logger.log(SP_Objet.indexOf(16));return;
  
  var counter = Number(PropertiesService.getUserProperties().getProperty("index"));
  counter = (counter >= SP_Objet.length) ? SP_Objet.indexOf(16) : counter;
  while (counter < SP_Objet.length) {
    
    //var error =   main(new Date("2019/12/27"),SP_Objet[counter]);
    if ((main(yesterday, SP_Objet[counter])) === 'Service invoked too many times for one day: urlfetch.') {
      return;
    }
    main(today, SP_Objet[counter]);
    counter++
      PropertiesService.getUserProperties().setProperty("index", counter);
    
  }
}



function updateMax_NUMBER_OF_SUBSCRIBERS() {
  var SP_Objet = JSON.parse(DriveApp.getFileById(QMedic_ScubscriberIDs_FileID).getBlob().getDataAsString());
  var Max_NUMBER_OF_SUBSCRIBERS =SP_Objet[SP_Objet.length-1];
  var currentSubscriberId = Max_NUMBER_OF_SUBSCRIBERS;
  var aupperLimit = currentSubscriberId + 20;
  while (++currentSubscriberId <aupperLimit ) {
    try {
      QMedicEventsFromS3Only.getEvents(currentSubscriberId, new Date());
      SP_Objet.push(currentSubscriberId)
      main(new Date(),currentSubscriberId);
      DriveApp.getFileById(QMedic_ScubscriberIDs_FileID).setContent(JSON.stringify(SP_Objet));
      
    }
    catch (e) {
       console.error(e);
    }
  }
  
  
  
}












//function updateMax_NUMBER_OF_SUBSCRIBERS() {
//  var SP_Objet = JSON.parse(DriveApp.getFileById(QMedic_ScubscriberIDs_FileID).getBlob().getDataAsString());
//  var Max_NUMBER_OF_SUBSCRIBERS = SP_Objet[SP_Objet.length-1];
//  var currentSubscriberId = Max_NUMBER_OF_SUBSCRIBERS;
//  var aupperLimit = currentSubscriberId + 20;
//  while (++currentSubscriberId <aupperLimit ) {
//    try {
//      getEvents(currentSubscriberId, new Date());
//      SP_Objet.push(currentSubscriberId)
//      main(new Date(),currentSubscriberId);
//      DriveApp.getFileById(QMedic_ScubscriberIDs_FileID).setContent(JSON.stringify(SP_Objet));
//    }
//    catch (e) {
//    }
//  }
//}