/**
 * Created by sunil on 12/25/2014.
 */

var settingsHandler = require('settingsHandler');
var uiHandler = require('uiHandler');
var storageSystem = require('storageSystem');
var self = require("sdk/self");
var data = self.data;

var jiraUrlList = {};

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
            if (params.spannQueryCounter && params.data && params.data.jiraData)
                storageSystem.addJiraData(params.spannQueryCounter, params.data.jiraData);
            exports.throttlingController('completedJira', params);
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
            var settings = settingsHandler.getSettings();
            params.worker.port.emit('settings', settings);
            params.worker.port.emit('startProcessing');
            break;

        case 'processingComplete' :
            /* empty the previously saved data */
            storageSystem.removeListDetails(params.spannQueryCounter);
            storageSystem.addJiraList(params.spannQueryCounter, params.data.jiraList);

            params.data.jiraUrlList = generateUrlList(params.data.baseUrl, params.data.jiraList);
            exports.throttlingController('start', params);
            break;

        case 'exportToExcel' :
            exports.exportController('exportToExcel', params);
            break;

        default :
            break;
    }
};

exports.throttlingController = function(message, params) {
    switch (message) {
        case 'start':
            var settings = settingsHandler.getSettings();
            jiraUrlList[params.spannQueryCounter] = params.data.jiraUrlList.slice(0);
            for (var i = 0; i < params.data.jiraUrlList.length; i++) {
                if (i === settings.numberOfJiraToProcessTogether)
                    break;
                exports.pageController('start', {url: params.data.jiraUrlList[i], spannQueryCounter: params.spannQueryCounter});
                //console.log("ForLoop: Removing "+params.data.jiraUrlList[i]+" from "+jiraUrlList[params.spannQueryCounter].toString());
                var index = jiraUrlList[params.spannQueryCounter].indexOf(params.data.jiraUrlList[i]);
                if (index > -1) {
                    jiraUrlList[params.spannQueryCounter].splice(index, 1);
                }
            }
            break;

        case 'completedJira' :
            /* removing the completed jira from remaining jira List */
            if (settingsHandler.getSettings().isEnabled) {
                if(jiraUrlList[params.spannQueryCounter] != undefined && jiraUrlList[params.spannQueryCounter].length > 0) {
                    exports.pageController('start', {url: jiraUrlList[params.spannQueryCounter][0], spannQueryCounter: params.spannQueryCounter});
                    //console.log("CompletedJira: Removing "+jiraUrlList[params.spannQueryCounter][0]+" from "+jiraUrlList[params.spannQueryCounter].toString());
                    var index = jiraUrlList[params.spannQueryCounter].indexOf(jiraUrlList[params.spannQueryCounter][0]);
                    if (index > -1) {
                        jiraUrlList[params.spannQueryCounter].splice(index, 1);
                    }
                }
            }
            break;
    }

};

exports.exportController = function (message, params) {
    switch (message) {
        case 'exportToExcel' :
            var tableHtml = storageSystem.getFinalDataHtml(params.spannQueryCounter);
            params.worker.port.emit('exportToExcel', tableHtml);
            break;
    }
};

exports.uiController = function (message, params) {
    switch (message) {
        case 'startProcessing' :
            if (settingsHandler.getSettings().isEnabled) {
                var baseUrl = settingsHandler.getSettings().baseJiraUrl;

                if (exports.isGarbageContent(params.data)) {
                    if (baseUrl) {

                        var jiraList = exports.extractJiraIds(params.data.toString());
                        if (jiraList.length > 0) {
                            var jiraUrlList = [];
                            for (var i in jiraList) {
                                var url = baseUrl + "browse/" + jiraList[i].trim();
                                jiraUrlList.push(url);
                            }
                            exports.uiController('startJiraProcessing', {
                                data: jiraUrlList.toString()
                            });
                            break;
                        } else {
                            console.log("there were no jira ID found");
                        }

                    } else {
                        console.log("baseUrl is not defined: "+baseUrl);
                    }
                }

                exports.uiController('startJiraProcessing', params);
                break;
            }
            break;

        case 'startJiraProcessing' :
            storageSystem.emptyJiraDetails();
            var dataCommaDelimited = params.data.split('\n').join(',');
            var urls = dataCommaDelimited.split(',');

            var inputJiraUrlList = [];
            for (var i in urls) {
                var url = urls[i];

                if (/.*jira.*(?:Dashboard|issues|jql|filter).*/.test(url)) {
                    exports.listController('start', {url: url});
                } else if (/.*jira.*?browse.*/.test(url)) {
                    inputJiraUrlList.push(url);
                }
            }

            if (inputJiraUrlList.length > 0) {
                exports.throttlingController('start', {
                    data: {
                        jiraUrlList: inputJiraUrlList
                    },
                    spannQueryCounter: storageSystem.getQueryCounter()
                });
            }
            break;

        case 'exportToExcel' :
            exports.pageController('exportToExcel', {
                worker: params.mainPanel
            });
            break;
    }
};

function generateUrlList(baseUrl, jiraList) {
    var result = [];
    for(var i in jiraList) {
        result.push(baseUrl + "browse/" + jiraList[i]);
    }
    return result;
}

exports.isGarbageContent = function(data) {
    return (!/.*http.*jira.*(?:Dashboard|issues|jql|filter|browse).*[a-zA-z]+-[\d]+/.test(data));
};

exports.extractJiraIds = function(content) {
    return content.match( /( |^|\s|\()[a-zA-z]+-[\d]+/gi );
};