/**
 * Created by sunil on 12/25/2014.
 */
var ss = require('sdk/simple-storage');

var totalData = {
    jiraList: [],
    jiraDetails: []
};

exports.getQueryCounter = function() {
    if(ss.storage.spannCounter == undefined) {
        ss.storage.spannCounter = 0;
    }
    ss.storage.spannCounter++;
    return ss.storage.spannCounter;
};

exports.addJiraList = function (jiraList) {
    totalData.jiraList = jiraList;
};

exports.addJiraData = function (extractedData) {
    totalData.jiraDetails.push(extractedData);
};

exports.getFinalDataJson = function () {
    return totalData;
};

exports.getFinalDataHtml = function () {
    var cols = [];
    var rows = [];
    var html = "";

    /* Preparing the heading for excel export */
    var firstJira = totalData.jiraDetails[0];
    for (var key in firstJira) {
        if (firstJira.hasOwnProperty(key))
            cols.push(key)
    }

    html += '<tr>';
    for (var i in cols) {
        html += '<th>' + cols[i].toUpperCase() + '</th>';
    }
    html += '</tr>';
    /* Preparing the heading for excel export */

    for (var i in totalData.jiraDetails) {
        var jira = totalData.jiraDetails[i];
        html += '<tr>';
        for (var key in jira) {
            if (jira.hasOwnProperty(key)) {
                html += '<td>' + jira[key] + '</td>';
            }
        }
        html += '</tr>';
    }

    html = '<table style="display: none" id="spannJiraExportTable">' + html + '</table>';
    return html;
};