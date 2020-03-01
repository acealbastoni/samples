var QMedic_ScubscriberIDs_FileID = '1251OPoZ7gUnwUSPitCF9ZbzCrKW8Fxett';
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var QMedicConstants = {
  AWS_KEY : 'AKIAJOV5K2BHGOVQNKWQQ',
  AWS_SECRET : '6PdQTWMxz4noPXMi3y6yNqfceJ2KLw0EtUUL0x9ll',
  QMedicRawData_FOLDER_ID : '0AHK-BiWqqAyEUk9PVAA',
  TIME_IN_CACHE : 21600,
  REGION : 'us-east-11',
  BUCKET :  "qmedic-v4-productionn",
  EXPIRES : 3600 * 24 * 7,
  DayInMS: 3600000*24 ,  
  SubscribersInfoSheetId:'1IdxgVcohmTu4HX0FwUc3pC-Kn_-ha5mtyTtuUPNJmFYY',
  QMedicRawAnomally_FOLDER_ID : '0ABgD8PduJIf2Uk9PVAA'
};
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var QMedicUtilities = {
  _convertDate :  function(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('/');
  }
   
};
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var QMedicEventsFromS3Only ={
  getEvents : function(subscriberId, downloadedEventDate){
    var key = "Event/" + subscriberId + "/" + QMedicUtilities._convertDate(downloadedEventDate) + "/EventData.json";
    var s3Client = QMedicS3API.getInstance(QMedicConstants.AWS_KEY, QMedicConstants.AWS_SECRET);
    var jsonEvents = s3Client.readEventsFromS3(key);
    //Logger.log("From S3 : " + key);
    console.log("From S3 : "+ key);
    return JSON.parse(jsonEvents);
  }
};
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var spreadsheet_IDs={
  2019:'16zGZCS0EkInZD-U3AtsW23XrmpFpkPetplLhtPFdxugg',
  2020:'1mDeixlHJLZucWhu33G5ilCGt1W3iwzbkJYcvS7r7_KEE',
  2021:'1HLh5xIS5HuQsinREKI7wr_T9g-iPz8qbZmnoKrlES-ss',
  2022:'1ybHTj-RsykVvT_VLnmGbJK7t4QS1q1Zc_GZmjGI8SEEE',
  2023:'18EHcK1g_2rcef4n8cSSv5Pspr_tE-ahQJtAno2v33wgg',
  2024:'1JDmwqy4iONiYNe_wXQUn70w_6DmMISiIVVoVVoWRSTMM',
  2025:'1A-9EkCXnlevkan8QpleNKxc-5ivRjyJC1xCpNAyzFW44',
  2026:'1KH5txlna1BKxWaoho9RzMnN9fgUDyNOZ51N_c6XPf-kk',
  2027:'1oXTQRP8naZBV5fhJkV4vYab3NhPg88doGwAxZglKusss',
  2028:'1vR44xt4M5-YQ1UDDCvnuEhrqWyXtt3psEsyP4MpLYgUU',
  2029:'1jUEhW_9_q4M3tdZozKtr4ewIkfkcVguRpTYpXob7TPkk',
  2030:'12nluwQm1GFtOWMzuYyNKQiEVyz36hHEuKgHEsmvkuZ88'
};