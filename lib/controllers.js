/**
 * Created by sunil on 12/25/2014.
 */

var settingsHandler = require('settingsHandler');
var uiHandler = require('uiHandler');
var storageSystem = require('storageSystem');
var self = require("sdk/self");
var data = self.data;

exports.pageController = function (message, params) {
    switch (message) {
        case 'start' :
            var jiraPageUrl = params.url;
            uiHandler.openTab(jiraPageUrl);
            break;

        case 'getSettings' :
            var spannQueryCounter = storageSystem.getQueryCounter();
            var settings = settingsHandler.getSettings();
            settings.spannQueryCounter = spannQueryCounter;
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;

        case 'processingComplete' :
            storageSystem.addJiraData(params.data.jiraData);
            break;

        case 'exportToExcel' :
            exports.exportController('exportToExcel', params);
            break;

        default :
            break;
    }
};

exports.listController = function (message, params) {
    switch (message) {
        case 'start' :
            var jiraListPageUrl = params.url;
            uiHandler.openListTab(jiraListPageUrl);
            break;

        case 'getSettings' :
            var spannQueryCounter = storageSystem.getQueryCounter();
            var settings = settingsHandler.getSettings();
            settings.spannQueryCounter = spannQueryCounter;
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;

        case 'processingComplete' :
            storageSystem.addJiraList(params.data.jiraList);
            break;

        default :
            break;
    }
};

exports.exportController = function (message, params) {
    switch (message) {
        case 'exportToExcel' :
            var tableHtml = storageSystem.getFinalDataHtml();
            params.worker.port.emit('exportToExcel', tableHtml);
            break;
    }
};

exports.uiController = function (message, params) {
    switch (message) {
        case 'startProcessing' :
            var dataCommaDelimited = params.data.split('\n').join(',');
            var urls = dataCommaDelimited.split(',');
            for (var i in urls) {
                var url = urls[i];
                var listRegex = new RegExp(".*jira.*(?:Dashboard|issues|jql).*");
                var singleJiraUrlRegex = new RegExp(".*jira.*?browse.*");
                if (listRegex.test(url)) {
                    exports.listController('start', {url: url});
                } else if (singleJiraUrlRegex.test(url)) {
                    exports.pageController('start', {url: url});
                }
            }
            break;
    }
};