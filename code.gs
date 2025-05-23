
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle('Attendance System')
      .addMetaTag('viewport', 'width=device-width , initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function clockIn(employee,gps){
  var response = Maps.newGeocoder().setRegion('IND').setLanguage('en-IN').reverseGeocode(gps[0],gps[1]);
  var location = response.results[0].formatted_address;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("MAIN");
  var lastRow = mainSheet.getLastRow();
  var new_date = new Date();
  var return_date = getDate(new_date);
  var msg = 'SUCCESS';
  var return_array = [];
  for (var j = 2; j <= lastRow; j++){
    if(employee ==  mainSheet.getRange(j, 1).getValue() && mainSheet.getRange(j,3).getValue() == ''){
    msg = '<br>Sorry, you have to ClockOut first!';
      return_array.push([msg, return_date, employee]);
      return return_array;
    }
  }
  mainSheet.getRange(lastRow+1,1).setValue(employee)
  .setFontSize(10);
  mainSheet.getRange(lastRow+1,2).setValue(new_date)
  .setNumberFormat("dd/MM/yyyy - HH:mm:ss")
  .setHorizontalAlignment("left")
  .setFontSize(10);
   mainSheet.getRange(lastRow+1,4).setValue(location)
  .setFontSize(10);
  return_array.push([msg, return_date, employee]);
  return return_array;
  }
function clockOut(employee,gps) {
  var response = Maps.newGeocoder().setRegion('IND').setLanguage('en-IN').reverseGeocode(gps[0],gps[1]);
  var location = response.results[0].formatted_address;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("MAIN");
  var lastRow = mainSheet.getLastRow();
  var foundRecord = false;
  var new_date = new Date();
  var return_date = getDate(new_date);
  var msg = 'SUCCESS';
  var return_array = [];
  for (var j = 2; j <= lastRow; j++){
      if(employee ==  mainSheet.getRange(j,1).getValue() && mainSheet.getRange(j,3).getValue() == ''){
        mainSheet.getRange(j,3)
        .setValue(new_date)
        .setNumberFormat("dd/MM/yyyy - HH:mm:ss")
        .setHorizontalAlignment("left")
        .setFontSize(10);
        mainSheet.getRange(j,5).setValue(location)
        .setFontSize(10);
        var totalTime = (mainSheet.getRange(j,3).getValue() - mainSheet.getRange(j,2).getValue()) /(60*60*1000);
        mainSheet.getRange(j,6).setValue(totalTime.toFixed(2))
        .setNumberFormat("#0.00")
        .setHorizontalAlignment("left")
        .setFontSize(12);  
        foundRecord = true;     
      }}
       if(foundRecord == false){
      return_array.push(['<br>Sorry, you have not ClockIn yet.', '', employee]);
      return return_array;}
      TotalHours();
      return_array.push([msg, return_date, employee]);
      return return_array;}
    function TotalHours(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();          
    var mainSheet = ss.getSheetByName("MAIN");
    var lastRow = mainSheet.getLastRow();
    var totals = [];
    for (var j = 2; j <= lastRow; j++){
    var rate = mainSheet.getRange(j, 6).getValue();
    var name = mainSheet.getRange(j, 1).getValue();
    var foundRecord = false;
    for(var i = 0; i < totals.length; i++){
       if(name == totals[i][0] && rate != ''){         
         totals[i][1] =  totals[i][1] + rate;
         foundRecord = true;}}
    if(foundRecord == false && rate != ''){
      totals.push([name, rate]);
    }}
  mainSheet.getRange("H2:I").clear();
  for(var i = 0; i < totals.length; i++){
    mainSheet.getRange(2+i,7).setValue(totals[i][0]).setFontSize(12);
    mainSheet.getRange(2+i,8).setValue(totals[i][1]).setFontSize(12);  
  } 
}
function addZero(i){
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function getDate(return_array){
  var currentDate = return_array;
  var currentMonth = currentDate.getMonth()+1;
  var currentYear = currentDate.getFullYear()+0;
  var currentHours = currentDate.getHours();
  var currentMinutes = addZero(currentDate.getMinutes());
  var currentSeconds = addZero(currentDate.getSeconds());
  var dateOutput =  'date ' + currentDate.getDate()+ '/' + currentMonth.toString().toString() + '/' + 
          currentYear.toString() + ' ' + currentHours.toString() + ':' +
          currentMinutes.toString() + ':' + currentSeconds.toString() + ' .';
  return dateOutput;
}
