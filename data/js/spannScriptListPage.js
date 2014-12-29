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
/* listeners */

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
        spannQueryCounter: appSettings.spannQueryCounter
    });
}