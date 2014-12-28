/**
 * Created by sunil on 12/25/2014.
 */

var button = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var panel = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;

/* global variables */
var mainPanel = panel.Panel({
    width: 402,
    height: 202,
    contentURL: data.url("html/main-panel.html"),
    contentScriptFile: [
        data.url('js/libs/jquery-2.1.1.min.js'),
        data.url("js/main-panel.js")
    ]
});
exports.mainPanel = mainPanel;

exports.openTab = function(url) {
    tabs.open(url);
};

var addSpannJiraButton = function() {
    var spannJiraButton = button.ActionButton({
        id: "spann-jira",
        label: "Spann Jira",
        icon: {
            "16": "./logo/spann-jira-logo-16.png",
            "32": "./logo/spann-jira-logo-32.png",
            "64": "./logo/spann-jira-logo-64.png"
        },
        onClick: function(state) {
            mainPanel.show({
                position: spannJiraButton
            });
        }
    });
};

exports.createUI = function() {
    addSpannJiraButton();
};