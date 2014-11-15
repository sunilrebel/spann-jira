/* Main JS Add on File */

/**
 * namespace: SpannJira
 * Author: Sunil
 */
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var data = self.data;

var SpannJira = {};

SpannJira.jiraList = [];
SpannJira.storage = {};


SpannJira.MainController = function(jiraList) {
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
