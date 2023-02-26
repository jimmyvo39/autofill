function onOpen() {
    var ui = DocumentApp.getUi();
    ui.createMenu('Generate Document')
      .addItem('Fill Form', 'showForm')
      .addToUi();
  }
  
  function showForm() {
    // id is found in url
    var templateId = '[google doc ID]';
    var folderId = 'google drive folder ID';
  
    var template = DriveApp.getFileById(templateId);
    var doc = DocumentApp.openById(templateId);
    var body = doc.getBody();
    var companyName = '';
  
    var ui = DocumentApp.getUi();
    var response = ui.prompt('Fill out this form to generate a new document:', 'Enter the name of the company:', ui.ButtonSet.OK_CANCEL);
  
    if (response.getSelectedButton() == ui.Button.OK) {
      companyName = response.getResponseText();
      var copy = template.makeCopy(doc.getName(), DriveApp.getFolderById(folderId));
      var newDoc = DocumentApp.openById(copy.getId());

    //   use <<company_name>> as placeholder in template and text 
      replaceText(newDoc, '<<company_name>>', companyName);
      newDoc.saveAndClose();
      ui.showModelessDialog(HtmlService.createHtmlOutput('The document has been generated successfully.').setWidth(250).setHeight(100), 'Done');
      var url = newDoc.getUrl();
      var html = '<script>window.open("' + url + '", "_blank");google.script.host.close();</script>';
      var userInterface = HtmlService.createHtmlOutput(html);
      DocumentApp.getUi().showModalDialog(userInterface, 'Generated Document');
    } else {
      doc.saveAndClose();
    }
  }
  
  function replaceText(doc, placeholder, replacement) {
    var body = doc.getBody();
    var searchResult = body.findText(placeholder);
  
    while (searchResult) {
      var found = searchResult.getElement();
      var start = searchResult.getStartOffset();
      var end = searchResult.getEndOffsetInclusive();
      found.editAsText().deleteText(start, end);
      found.editAsText().insertText(start, replacement);
      searchResult = body.findText(placeholder, searchResult);
    }
    
    var title = doc.getName();
    if (title.indexOf(placeholder) !== -1) {
      var newTitle = title.replace(placeholder, replacement);
      doc.setName(newTitle);
    }
  }
  
// open your template doc and designated folder

// in your template doc go to extentions tab >> Apps Script

// paste this code above 

// modify these 2 variable to your IDs and save
// var templateId = '[google doc ID]';
// var folderId = 'google drive folder ID';

// refresh the template, now a new tab is available to use the script


// you can start the prompt upon open the doc:

// click triggers(on the left)
// select showForm function to run On open event and save