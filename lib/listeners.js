/**
 * Created by sunil on 12/25/2014.
 */

var controllers = require('controllers');
var storageSystem = require('storageSystem');

var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var data = self.data;

/* Attach jira page listner */
pageMod.PageMod({
    include: /.*jira.*?browse.*/, // todo these all listner will be added to specific tabs opened by addon
    contentScriptFile: [
        data.url("js/libs/jquery-2.1.1.min.js"),
        data.url('js/dataExtractors.js'),
        data.url('js/exports.js'),
        data.url("js/spannScriptSinglePage.js")
    ],
    onAttach: function(worker) {
        worker.port.on('getSettings', function() {
            controllers.pageController('getSettings', {
                worker: worker
            });
        });
        worker.port.on('processingComplete', function(extractedData) {
            controllers.pageController('processingComplete', {
                worker: worker,
                extractedData: extractedData
            });
        });

        worker.port.on('getFinalDataJson', function() {
            console.log("[FINAL]: "+JSON.stringify(storageSystem.getFinalDataJson()));
        });

        worker.port.on('exportToExcel', function() {
            controllers.pageController('exportToExcel', {
                worker: worker
            });
        });
    }
});
/* Attach jira page listner */


/* Attach jira listing page listner */
pageMod.PageMod({
    include: /.*jira.*(?:Dashboard|issues|jql).*/,
    contentScriptFile: [
        data.url('js/libs/jquery-2.1.1.min.js'),
        data.url('js/dataExtractors.js'),
        data.url('js/spannScriptListPage.js')
    ],
    onAttach: function(worker) {
        worker.port.on('getSettings', function() {
            controllers.listController('getSettings', {
                worker: worker
            });
        });
        worker.port.on('processingComplete', function(jiraList) {
            controllers.listController('processingComplete', {
                worker: worker,
                jiraList: jiraList
            });
        });
    }
});
/* Attach jira listing page listner */