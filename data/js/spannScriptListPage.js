/**
 * Created by sunil on 12/26/2014.
 */

var appSettings;
var jiraList = [];

/* on page load function */
$(function () {
    self.port.emit('getSettings');
});
/* on page load function */

/* listeners */
self.port.on('settings', function (settings) {
    appSettings = settings;
    setTimeout(function() {
        self.port.emit('getSettings');
    }, 3000)
});
self.port.on('startProcessing', function () {
    setInterval(function () {
        if (appSettings.isEnabled) {
            if ($('a#spann-export').length < 1)
                addHtml();
        } else {
            removeHtml();
        }
    }, 1000);
});
self.port.on('exportToExcel', function (tableHtml) {
    addTableAndExportToExcel(tableHtml);
});
/* listeners */

function process() {
    jiraListExtractor.startJiraListExtraction('onComplete', function (jiraList) {
        processingComplete(jiraList);
    });
}

function exportToExcel() {
    self.port.emit('exportToExcel');
}

function addHtml() {
    var processButtonHtml = '<li><a class="aui-button" href="#" title="Process Jira List" id="spann-process">Process</a></li>';
    var exportButtonHtml = '<li><a class="aui-button" href="#" title="Export Data" id="spann-export">Export</a></li>';

    $("div#search-header-view ul.filter-operations:first").append(processButtonHtml);
    $("div#search-header-view ul.filter-operations:first").append(exportButtonHtml);

    $("a#spann-process").click(function () {
        process();
    });
    $("a#spann-export").click(function () {
        exportToExcel();
    });
}

function removeHtml() {
    $("#spann-process").parent("li").remove();
    $("#spann-export").parent("li").remove();
}

function processingComplete(jiraList) {
    self.port.emit('processingComplete', {
        jiraList: jiraList,
        baseUrl: fetchBaseUrl()
    });
}

function fetchBaseUrl() {
    var url = window.location.toString();
    var cutIndex = (url.indexOf("browse") > -1) ? url.indexOf("browse") : url.indexOf("issues");
    return url.substring(0, cutIndex);
}