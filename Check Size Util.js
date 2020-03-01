// this Code is to get The Size of the returned jsonFile on desk
function memorySizeOf(obj) {
  var bytes = 0;
  
  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  };
  
  
  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes // + " bytes";
    else if (bytes < 1048576) return (bytes / 1024)//.toFixed(3) + " KiB";
    else if (bytes < 1073741824) return (bytes / 1048576)//.toFixed(3) + " MiB";
    else return (bytes / 1073741824)//.toFixed(3) + " GiB";
      };
  
  return formatByteSize(sizeOf(obj));
};



//--------------------------------------------------------------------------------------------------------
function updateCell_(columnNumber,subscriberId){
  var sheet = SpreadsheetApp.openById(All_Suscribers_SheetID).getSheetByName("sheet1");
  // Single column
  var column = sheet.getRange(2, columnNumber,sheet.getLastRow());
  
  column.setNumberFormat("####.#");
  sheet.getRange(2,columnNumber).setValue(subscriberId);
  //SpreadsheetApp.flush();
}

function deleteTriggerByName(TriggerName){
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[i].getHandlerFunction() === TriggerName) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}

function getSubscriberId_(columnNumber){
  var sheet = SpreadsheetApp.openById(All_Suscribers_SheetID).getSheetByName("sheet1")
  var subscriberId= sheet.getRange(2,columnNumber).getValue();
  return subscriberId;
}

var All_Suscribers_SheetID = '1uawq4hb1WbTynEzBR96V0H267GRFvKhDPDaAmCg9KmA';