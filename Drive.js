function getJsonEventsFromDrive_(key) {
  //  var subFolderNames = ["Event", "1005", "2018", "08", "09", "EventData"];
  var QMedicRawData_FOLDER = DriveApp.getFolderById(QMedicConstants.QMedicRawData_FOLDER_ID);
  var parentFolder = QMedicRawData_FOLDER; // folder
  
  var subFolderNames = key.split("/");
  var i = 0;
  var file = null;
  while (parentFolder.getFoldersByName(subFolderNames[i]).hasNext()) {
    parentFolder = parentFolder.getFoldersByName(subFolderNames[i]).next();
    i++;
    file = DriveApp.getFolderById(parentFolder.getId()).getFiles().hasNext() ? DriveApp.getFolderById(parentFolder.getId()).getFiles().next() : null;
  }
  if (file !== null) {
    var data = DriveApp.getFileById(file.getId()).getAs(MimeType.PLAIN_TEXT).getDataAsString();
    return data;
  }
  return null;
}
function putAsJsonInDrive_(subscriberId, date, jsonEvent) {
  var key = "Event/" + subscriberId + "/" + QMedicUtilities._convertDate(date) + "/EventData.json";
  var QMedicRawData_FOLDER = DriveApp.getFolderById(QMedicConstants.QMedicRawData_FOLDER_ID);
  var parentFolder = QMedicRawData_FOLDER; // folder
  var subFolderNames = key.split("/");
  var counter = 0;
  var file = null;
  while (parentFolder.getFoldersByName(subFolderNames[counter]).hasNext()) {
    parentFolder = parentFolder.getFoldersByName(subFolderNames[counter]).next();
    counter++;
    file = DriveApp.getFolderById(parentFolder.getId()).getFiles().hasNext() ? DriveApp.getFolderById(parentFolder.getId()).getFiles().next() : null;
  }
  if (file){
    file.setContent(jsonEvent);
    return;
  }
  var path = subscriberId.toString() + "/" + QMedicUtilities._convertDate(date.toString());
  var deeperFolderId = createDirectory_(path);
  var deeperFolder = DriveApp.getFolderById(deeperFolderId);
  deeperFolder.createFile("EventData.json", jsonEvent, MimeType.PLAIN_TEXT);
}


