/**
 * Created by sunil on 12/25/2014.
 */

var settingsHandler = require('settingsHandler');
var uiHandler = require('uiHandler');
var storageSystem = require('storageSystem');
var self = require("sdk/self");
var data = self.data;

var jiraList = [];

exports.pageController = function (message, params) {
    switch (message) {
        case 'start' :
            if(!params.spannQueryCounter)
                params.spannQueryCounter = storageSystem.getQueryCounter();
            
            var jiraPageUrl = params.url;
            uiHandler.openTab(jiraPageUrl, params.spannQueryCounter);
            break;

        case 'getSettings' :
            var settings = settingsHandler.getSettings();
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;

        case 'processingComplete' :
            storageSystem.addJiraData(params.spannQueryCounter, params.data.jiraData);
            params.jiraId = params.data.jiraData.id;
            exports.listController('completedJira', params);
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
            if(!params.spannQueryCounter)
                params.spannQueryCounter = storageSystem.getQueryCounter();
            
            var jiraListPageUrl = params.url;
            uiHandler.openListTab(jiraListPageUrl, params.spannQueryCounter);
            break;

        case 'getSettings' :
            var settings = settingsHandler.getSettings();
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;

        case 'processingComplete' :
            storageSystem.addJiraList(params.spannQueryCounter, params.data.jiraList);
            exports.listController('startJiraProcessing', params);
            break;

        case 'startJiraProcessing' :
            var settings = settingsHandler.getSettings();
            jiraList = params.data.jiraList;
            for (var i = 0; i < jiraList.length; i++) {
                if (i === settings.numberOfJiraToProcessTogether)
                    break;
                var jiraUrl = params.data.baseUrl + "browse/" + jiraList[i];
                exports.pageController('start', {url: jiraUrl, spannQueryCounter: params.spannQueryCounter});
            }
            break;

        case 'completedJira' :
            if(jiraList != undefined && jiraList.length !== 0) {
                var jiraId = params.jiraId;
                var index = jiraList.indexOf(jiraId);
                if (index > -1) {
                    jiraList.splice(index, 1);
                }
                var jiraUrl = params.data.baseUrl + "browse/" + jiraList[0];
                exports.pageController('start', {url: jiraUrl, spannQueryCounter: params.spannQueryCounter});
            }
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