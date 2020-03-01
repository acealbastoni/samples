//Create folder if does not exists only
function createFolder_(folderID, folderName) {
  var parentFolder = DriveApp.getFolderById(folderID);
  var subFolders = parentFolder.getFolders();
  var doesntExists = true;
  var newFolder = '';
  // Check if folder already exists.
  while (subFolders.hasNext()) {
    var folder = subFolders.next();

    //If the name exists return the id of the folder
    if (folder.getName() === folderName) {
      doesntExists = false;
      newFolder = folder;
      return newFolder.getId();
    }
  }
  //If the name doesn't exists, then create a new folder
  if (doesntExists === true) {
    //If the file doesn't exists
    newFolder = parentFolder.createFolder(folderName);
    return newFolder.getId();
  }
}
function createDirectory_(path) {
  // The Basic Event Folder Id That i created First Time Only
  // DriveApp.getFolderById("");
  var FOLDER_ID = DriveApp.getFolderById(QMedicConstants.QMedicRawData_FOLDER_ID).getFoldersByName("Event").hasNext() ? DriveApp.getFolderById(QMedicConstants.QMedicRawData_FOLDER_ID).getFoldersByName("Event").next().getId() : DriveApp.getFolderById(QMedicConstants.QMedicRawData_FOLDER_ID).createFolder("Event").getId();
  var newFoldersArray = path.split('/');  //[1005, 2018, 08, 02]    
  var i = 0;
  while (i < newFoldersArray.length) {
    FOLDER_ID = createFolder_(FOLDER_ID, newFoldersArray[i]);
    i++;
  }
  // Logger.log(data)
  return FOLDER_ID; // The Id of The folder that actually containing The Spreadsheeet 

}
