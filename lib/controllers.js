/**
 * Created by sunil on 12/25/2014.
 */
    
var settingsHandler = require('settingsHandler');
var uiHandler = require('uiHandler');
var storageSystem = require('storageSystem');

exports.pageController = function(message, params) {
    switch (message) {
        case 'start' :
            var jiraPageUrl = params.url;
            uiHandler.openTab(jiraPageUrl);            
            break;
        
        case 'getSettings' :
            var settings = settingsHandler.getSettings();
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;
        
        case 'processingComplete' :
            storageSystem.addJiraData(params.extractedData);
            break;
        
        default :
            break;
    } 
};

exports.exportController = function(message, params) {
    switch (message) {
        case 'exportToExcel' :
            var tableHtml = storageSystem.getFinalDataHtml();
            params.worker.port.emit('exportToExcel', tableHtml);
            break;
    } 
};