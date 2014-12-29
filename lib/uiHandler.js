/**
 * Created by sunil on 12/25/2014.
 */

var controllers = require('controllers');

var button = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var panel = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;

/* global variables */
var mainPanel;

exports.openTab = function (url) {
    tabs.open({
        url: url,
        onReady: function (tab) {
            var worker = tab.attach({
                contentScriptFile: [
                    data.url("js/libs/jquery-2.1.1.min.js"),
                    data.url('js/dataExtractors.js'),
                    data.url('js/exports.js'),
                    data.url("js/spannScriptSinglePage.js")
                ]
            });
            worker.port.on('getSettings', function () {
                controllers.pageController('getSettings', {
                    worker: worker
                });
            });
            worker.port.on('processingComplete', function (extractedData) {
                controllers.pageController('processingComplete', {
                    worker: worker,
                    extractedData: extractedData
                });
            });

            worker.port.on('getFinalDataJson', function () {
                console.log("[FINAL]: " + JSON.stringify(storageSystem.getFinalDataJson()));
            });

            worker.port.on('exportToExcel', function () {
                controllers.pageController('exportToExcel', {
                    worker: worker
                });
            });
        }
    });
};

exports.openListTab = function (url) {
    tabs.open({
        url: url,
        onReady: function (tab) {
            var worker = tab.attach({
                contentScriptFile: [
                    data.url('js/libs/jquery-2.1.1.min.js'),
                    data.url('js/dataExtractors.js'),
                    data.url('js/spannScriptListPage.js')
                ]
            });
            worker.port.on('getSettings', function () {
                controllers.listController('getSettings', {
                    worker: worker
                });
            });
            worker.port.on('processingComplete', function (jiraList) {
                controllers.listController('processingComplete', {
                    worker: worker,
                    jiraList: jiraList
                });
            });
        }
    });
};

var createMainPanel = function () {
    mainPanel = panel.Panel({
        width: 402,
        height: 202,
        contentURL: data.url("html/main-panel.html"),
        contentScriptFile: [
            data.url('js/libs/jquery-2.1.1.min.js'),
            data.url("js/main-panel.js")
        ]
    });
    mainPanel.port.on('startProcessing', function (data) {
        controllers.uiController('startProcessing', {data: data});
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