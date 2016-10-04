// Usage
//  1a. Enter sheet name where data is to be written below
// Alter the name of the sheet if you have multiple sheet of if you've renamed your sheet to something else
        var SHEET_NAME = "Sheet1";

// 1b. Enter the id of you Spreadsheet
        var SpreadsheetID = "1_LLzvAwPKAnLSqCT6eO9n44YrkFwKyJ5dMBwqn1Kw9M";

        
//  2. Run > setup
//
//  3. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//
//  4. Copy the 'Current web app URL' and post this in your form/script action 
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(e){
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

function handleResponse(e) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  
  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty(SpreadsheetID));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = []; 
    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
        row.push(new Date());
      } else { // else use header name to get data
        row.push(e.parameter[headers[i]]);
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results
    
    //make the results into a JSON object
    result = JSON.stringify({
      "result":"success", "row": nextRow
    }); 
    
    //return the results in a jsonp format
    return ContentService
          .createTextOutput(e.parameter.callback + "(" + result + ")")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch(e){
    // if error return this
    
    //make the results into a JSON object
    result = JSON.stringify({
      "result":"error", "error": e
    });  
    
    //return the results in a jsonp format
    return ContentService
          .createTextOutput( result )
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }finally { //release lock
    lock.releaseLock();
  }
}


function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty(SpreadsheetID, doc.getId());
}
