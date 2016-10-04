# How to fill a google spreadsheet asynchronously using a form and input fields you have on your webpage markup

I have been trying to figure this out for a while, and after googling away for the last week and a half or so I think I've been able to put the pieces together on how you can successfully and _insecurely_ collect **insensitive** user information from your website page and populate a google spreadsheet.
#### Early warning:
In all honestly it might be way easier to just set up a Google Form and direct users to the form link and have the form submit the results to a spreadsheet. 
Also tThis should not under any circumstances be treated as an alternative to a proper database.

That being said, I think this is a very easy and highly customizable way to collect data from different sources and have it fill up a spreadsheet and from there the possibilities are endless.

### Step 1
Create a Blank Google Spreadseet and publish it. After publishing it you'll be notified to what url you can use to access your spread sheet. The url will contain the spreadsheet id. Which we'll use in the following step.
Here's a [link to a spreadsheet](https://docs.google.com/spreadsheets/d/1_LLzvAwPKAnLSqCT6eO9n44YrkFwKyJ5dMBwqn1Kw9M/pubhtml) I created and published. You might try to use it as a reference.
As you can tell from the url, the SpreadsheetID is **1_LLzvAwPKAnLSqCT6eO9n44YrkFwKyJ5dMBwqn1Kw9M**

### Step  2
Create a Google Script Macro by going Tools > Script editor...
Clear out any deafult lines of code in the editor and copy the code from the GSCRIPT file in this repo and post it in your spreadsheet's script editor.
Change the sheet variable, if need be, and the SpreadsheetID to your SpreadsheetID. Save the script. You'll be prometed to write a project name at first. Then Run > setup. Give authorization for the script to access the data in the spreadsheet.
Go to Publish > Deploy as web app... To make sure anyone can post data into your spreadsheet through your html form, you'll need to set the execution of the app by you (it will say 'Me' in the deploy as web app prompt). Then make sure anyone can access the app evn anonymous to ensure that anyone can post to the sheet. You can make restriction as needed. Copy the script url of your now deployed web app, it'll be used in step No. 4.
ScriptURL: https://script.google.com/macros/s/AKfycbwPpM8GRsH3jQ_0PUMWx0YL7N3bfJtILoI_J3rgYHiyqtqLSaY/exec

### Step 3
Create in the markup of your html page a form with inputs. Make sure you give unique ids to each input field in the form.
Blow is a snippet of the markup

``` html
<form id="fillthesheet">
  <div class="form-group">
    <label for="exampleInputEmail1">Favourite Fruit</label>
    <input type="text" class="form-control" id="FavFruit" placeholder="Fruit, e.g. orange, ovacado...">
  </div>
.........
</form>
```

### Step 4
Next we'll need to write a few line of JavaScipt to prevent the default form sending processes and handle the form submission asynchonously with ajax and jsonp.
Change the ScriptURL to ther script url acquired from step No. 2
Write up a success callback for when the form is submitted. Here I just popup a paragraph that says informs of the success.

``` javascript
$( "#fillthesheet" ).submit(function( event ) {
  event.preventDefault();

  var showConfirmation = function (data){
    $('#confirming').fadeIn(320).delay(1800).fadeOut(500);
    console.log(data);
  }


  // Paste the url of your web app scriptUrl from step 2 below

  var scriptUrl = "https://script.google.com/macros/s/AKfycbwPpM8GRsH3jQ_0PUMWx0YL7N3bfJtILoI_J3rgYHiyqtqLSaY/exec";
  scriptUrl += '?' + $.param({
    // Make sure the key: value parameters are in the following order
    // SpreadsheetColumnHeader: input'sValue
    'Favourite Fruit': $('#FavFruit').val()
  });

  $.ajax({
      crossDomain: true,
    url: scriptUrl,
    method: "GET",
    dataType: "jsonp",
    success: showConfirmation
  });
});
```

_The full layout of the page can be seen in index.html_

**Notice** that you wont be able to populate the spreadsheet withough having written atleast one column header name.

### Step 5
That's it. Host your page and tell others to check it out and fill it out.



## Tribute
Thanks to these wonderful people's blog posts for giving me a supersonic head-start.
* Martin Hawksey
  - [Link to Blog Post](https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/)
  - [Link to Gist](https://gist.github.com/mhawksey/1276293)
  
* Amit Agarwal 
  - [Make AJAX Request to Google Script Web App with jQuery](https://ctrlq.org/code/20197-jquery-ajax-call-google-script)

