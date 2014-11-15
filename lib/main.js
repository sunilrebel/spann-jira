/* Main JS Add on File */

/**
 * namespace: SpannJira
 * Author: Sunil
 */
var button = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var panel = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;

var SpannJira = {};

SpannJira.jiraList = [];
SpannJira.storage = {};

SpannJira.Init = function() {
    var ui = new SpannJira.UIHandler();
    ui.initialize();
};

SpannJira.MainController = function() {
    var input = "https://jira.mongodb.org/issues/?jql=text%20~%20%22mongo%22";
    this.startProcessing = function() {
        var inputProcessor = new SpannJira.InputProcessor(this.input);
        var jiraList = inputProcessor.getJiraList();
        SpannJira.TabController.openTabs(jiraList);
        var jiraProcessor = new SpannJira.JiraProcessor(jiraList)
        jiraProcessor.process();
    }
};

SpannJira.InputProcessor = function(input) {
    this.input = input;
    this.getJiraList = function() {

    }
};

SpannJira.TabController = function() {
    this.openTabs = function(jiraList) {

    }
};

SpannJira.DataExtractor = function() {

};

SpannJira.JiraDetailExtractor = function(jira) {

};

SpannJira.JiraListExtractor = function() {

};

SpannJira.JiraProcessor = function(jiraList) {
    this.jiraList = jiraList;
    this.process = function() {

    }
};

SpannJira.UIHandler = function() {
    this.initialize = function() {
        var mainPanel = panel.Panel({
            contentURL: data.url("main-panel.html"),
            contentScriptFile: [
                data.url("main-panel.js")
            ]
        });

        button.ActionButton({
            id: "spann-jira",
            label: "Spann Jira",
            icon: {
                "16": "./logo/spann-jira-logo-16.png",
                "32": "./logo/spann-jira-logo-32.png",
                "64": "./logo/spann-jira-logo-64.png"
            },
            onClick: function(state) {
                mainPanel.show();
            }
        });
    }
};

new SpannJira.Init();


//pageMod.PageMod({
//    include: /.*jira.*/,
//    contentScriptFile: [
//        data.url("jquery-2.1.1.min.js"),
//        data.url("jquery.xpath.min.js"),
//        data.url("spann-jira.js")
//    ]
//});
//
//tabs.open("https://jira.mongodb.org/issues/?jql=text%20~%20%22mongo%22");
