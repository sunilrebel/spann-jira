/**
 * Created by sunil on 12/25/2014.
 */
var ss = require('sdk/simple-storage');

var finalData = {
    listDetails: {},
    jiraDetail: []
};

exports.getQueryCounter = function () {
    if (ss.storage.spannCounter == undefined) {
        ss.storage.spannCounter = 0;
    }
    ss.storage.spannCounter++;
    return ss.storage.spannCounter;
};

exports.addJiraList = function (key, jiraList) {
    finalData.listDetails[key] = {jiraList: jiraList, jiraDetail: []};
};

exports.addJiraData = function (key, extractedData) {
    if (!finalData.listDetails[key]) {
        finalData.jiraDetail.push(extractedData);
    } else if (finalData.listDetails[key]["jiraDetail"] != undefined) {
        finalData.listDetails[key]["jiraDetail"].push(extractedData);
    }
};

exports.getFinalDataJson = function () {
    return finalData;
};

exports.getFinalDataHtml = function (spannQueryCounter) {
    var cols = [];
    var rows = [];
    var html = "";

    var jiraDetail = [];

    if (spannQueryCounter == undefined)
        jiraDetail = finalData.jiraDetail;
    else if (spannQueryCounter != undefined)
        jiraDetail = finalData.listDetails[spannQueryCounter].jiraDetail;

    /* Preparing the heading for excel export */
    var firstJira = jiraDetail[0];
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

    for (var i in jiraDetail) {
        var jira = jiraDetail[i];
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