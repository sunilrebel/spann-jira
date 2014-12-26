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
    switch (true) {
        case true:
            jiraListExtractor.startJiraListExtraction('onComplete', function(jiraList) {
                processingComplete(jiraList);
            });
            break;

        case false:
            break;
    }
}

function processingComplete(jiraList) {
    self.port.emit('processingComplete', jiraList);
}