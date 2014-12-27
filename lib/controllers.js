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

        case 'exportToExcel' :
            exports.exportController('exportToExcel',params);
            break;
        
        default :
            break;
    } 
};

exports.listController = function(message, params) {
    switch (message) {
        case 'start' :
            var jiraListPageUrl = params.url;
            uiHandler.openTab(jiraListPageUrl);
            break;

        case 'getSettings' :
            var settings = settingsHandler.getSettings();
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;

        case 'processingComplete' :
            storageSystem.addJiraList(params.jiraList);
            break;

        default :
            break;
    }
};

exports.exportController = function(message, params) {
    switch (message) {
        case 'exportToExcel' :
            console.log("jelllo")
            var tableHtml = storageSystem.getFinalDataHtml();
            params.worker.port.emit('exportToExcel', tableHtml);
            break;
    } 
};