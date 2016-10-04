# How to fill a google spreadsheet asynchronously using a form and input fields you have on your webpage markup

I have been trying to figure this out for a while, and after googling away for the last week and a half or so I think I've been able to put the pieces together on how you can successfully and _insecurely_ collect **insensitive** user information from your website page and populate a google spreadsheet.
#### Early warning:
In all honestly it might be way easier to just set up a Google Form and direct users to the form link and have the form submit the results to a spreadsheet. 
Also tThis should not under any circumstances be treated as an alternative to a proper database.

That being said, I think this is a very easy and highly customizable way to collect data from different sources and have it fill up a spreadsheet and from there the possibilities are endless.

### Step 1
Create a Google Spreadseet and publish it. After publishing it you'll be notified to what url you can use to access your spread sheet. The url will contain the spreadsheet id. Which we'll use in the following step.


### Step  2
Create a Google Script Macro by going Tools > Script editor...
copy the code from the GSCRIPT file in this repo and post it in your spreadsheet's script editor.
Change the sheet variable if need be and the spreadsheetID to your spreadsheetID. Save the script and publish it as a webapp. Copy the script url, it'll be used in step No. 4.


### Step 3
Create in the markup of your html page a form with inputs. Make sure you give unique ids to each input field in the form.

### Step 4
Next we'll need to write a few line of JavaScipt to prevent the default form sending processes and handle the form submission asynchonously with ajax and jsonp.
Change the ScriptURL to ther script url acquired from step No. 2
Write up a success callback for when the form is submitted. Here I just popup a paragraph that says informs of the success. 

### Step 5
That's it. Host your page and tell others to check it out and fill it out.



## Tribute
Thanks to these wonderful people's blog posts for giving me supersonic lift head-start.
* GS - dfsdf
* JSONP Handler - sdfs
