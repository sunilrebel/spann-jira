/**
 * Created by sunil on 12/26/2014.
 */

var appSettings;
var jiraList = [];

/* on page load function */
$(function() {
    self.port.emit('getSettings');
});
/* on page load function */

/* listeners */
self.port.on('settings', function(settings) {
    appSettings = settings;
});
self.port.on('startProcessing', function() {
    process();
});
self.port.on('exportToExcel', function(tableHtml) {
    addTableAndExportToExcel(tableHtml);
});
/* listeners */

/* events */
$(document).dblclick(function(){
    self.port.emit('exportToExcel');
});
/* events */

function process() {
    setTimeout(function() {
        jiraListExtractor.startJiraListExtraction('onComplete', function(jiraList) {
            processingComplete(jiraList);
        });
    }, 5000);
}

function processingComplete(jiraList) {
    self.port.emit('processingComplete', {
        jiraList: jiraList,
        spannQueryCounter: appSettings.spannQueryCounter,
        baseUrl: fetchBaseUrl()
    });
}

function fetchBaseUrl() {
    var url = window.location.toString();
    var cutIndex = (url.indexOf("browse") > -1)? url.indexOf("browse") : url.indexOf("issues");
    return url.substring(0, cutIndex);
}