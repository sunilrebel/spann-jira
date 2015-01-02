/**
 * Created by sunil on 12/25/2014.
 */

var controllers = require('controllers');
var settingsHandler = require('settingsHandler');

var button = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var panel = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;

/* global variables */
var mainPanel;

exports.openTab = function (url, spannQueryCounter) {
    tabs.open({
        url: url,
        onReady: function (tab) {
            var worker = tab.attach({
                contentScriptFile: [
                    data.url("js/libs/jquery-2.1.1.min.js"),
                    data.url('js/dataExtractors.js'),
                    data.url('js/exports.js'),
                    data.url('js/commons.js'),
                    data.url("js/spannScriptSinglePage.js")
                ]
            });
            worker.port.on('getSettings', function () {
                controllers.pageController('getSettings', {
                    worker: worker
                });
            });
            worker.port.on('processingComplete', function (params) {
                controllers.pageController('processingComplete', {
                    worker: worker,
                    data: params,
                    spannQueryCounter: spannQueryCounter
                });
            });

            worker.port.on('exportToExcel', function () {
                controllers.pageController('exportToExcel', {
                    worker: worker
                });
            });
            
            worker.port.on('closeTab', function() {
                tab.close();
            });
        }
    });
};

exports.openListTab = function(url) {
    tabs.open(url);
};

var createMainPanel = function () {
    mainPanel = panel.Panel({
        width: 402,
        height: 202,
        contentURL: data.url("html/main-panel.html"),
        contentScriptFile: [
            data.url('js/libs/jquery-2.1.1.min.js'),
            data.url("js/commons.js"),
            data.url("js/main-panel.js")
        ]
    });
    mainPanel.port.on('startProcessing', function (data) {
        controllers.uiController('startProcessing', {data: data});
    });
    mainPanel.port.on('saveCustomField', function (params) {
        settingsHandler.saveCustomField({
            mainPanel: mainPanel,
            data: params
        });
    });
    mainPanel.port.on('removeCustomField', function (params) {
        settingsHandler.removeCustomField({
            mainPanel: mainPanel,
            data: params
        });
    });
    mainPanel.port.on('getSettings', function() {
        var settings = settingsHandler.getSettings();
        mainPanel.port.emit('settings', settings);
    });
};

var addSpannJiraButton = function () {
    var spannJiraButton = button.ActionButton({
        id: "spann-jira",
        label: "Spann Jira",
        icon: {
            "16": "./logo/spann-jira-logo-16.png",
            "32": "./logo/spann-jira-logo-32.png",
            "64": "./logo/spann-jira-logo-64.png"
        },
        onClick: function (state) {
            mainPanel.show({
                position: spannJiraButton
            });
        }
    });
};

exports.createUI = function () {
    createMainPanel();
    addSpannJiraButton();
};

exports.buildUrl = function(base, key, value) {
    var sep = (base.indexOf('?') > -1) ? '&' : '?';
    return base + sep + key + '=' + value;
};