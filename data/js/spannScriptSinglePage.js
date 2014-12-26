/**
 * Created by sunil on 12-10-2014.
 */

var spannJiraSettings;

/* on page load */
$(function(){
    self.port.emit('getSettings');
});
/* on page load */

/* listeners */
self.port.on('settings', function(settings){
    spannJiraSettings = settings;
});
self.port.on('startProcessing', function(){
    process();
});
self.port.on('exportToExcel', function(tableHtml) {
    addTableAndExportToExcel(tableHtml);
});
/* listeners */

/* events */
$(document).dblclick(function(){
    self.port.emit('getFinalDataJson'); 
    self.port.emit('exportToExcel');
});
/* events */

function process() {
    
    switch (isUserInputRequired(spannJiraSettings)) {
        case true :
            // display fields & attach click event
            break;
        case false :
            var extractedData = jiraDataExtractor.getData();
            processingComplete(extractedData);
            break;
    }

    function isUserInputRequired(settings) {
        return settings.userInputRequired;
    }
    
    /*var items=[];
    $('#issuetable').find('tbody tr td:nth-child(2)').each( function(){
        items.push( "https://jira.mongodb.org/browse/"+$(this).text() );
    });
    items = $.unique( items );
    $.each( items, function(i, item){
        if(i<4) {
            console.log(item)
        }
    })*/
}

function processingComplete(jiraData) {
    self.port.emit('processingComplete', jiraData);
}