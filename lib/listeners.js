/**
 * Created by sunil on 1/1/2015.
 */
var controllers = require('controllers');
var storageSystem = require('storageSystem');

var pageMod = require("sdk/page-mod");
var selection = require("sdk/selection");
var self = require("sdk/self");
var data = self.data;

pageMod.PageMod({
    include: /.*jira.*(?:Dashboard|issues|jql|filter).*/,
    contentScriptFile: [
        data.url('js/libs/jquery-2.1.1.min.js'),
        data.url('js/dataExtractors.js'),
        data.url('js/exports.js'),
        data.url('js/commons.js'),
        data.url('js/spannScriptListPage.js')
    ],
    onAttach: function(worker) {
        var spannQueryCounter = storageSystem.getQueryCounter();
        
        worker.port.on('getSettings', function () {
            controllers.listController('getSettings', {
                worker: worker
            });
        });
        worker.port.on('processingComplete', function (params) {
            controllers.listController('processingComplete', {
                worker: worker,
                data: params,
                spannQueryCounter: spannQueryCounter
            });
        });
        worker.port.on('exportToExcel', function () {
            controllers.pageController('exportToExcel', {
                worker: worker,
                spannQueryCounter: spannQueryCounter
            });
        });
    }
});

var contextMenu = require("sdk/context-menu");
contextMenu.Item({
    label: "Process with Spann Jira",
    context: cm.SelectionContext(),
    contentScript: 'self.on("click", self.postMessage);',
    onMessage: function () {
        var text = selection.text;
        controllers.uiController('startProcessing', {
            data: text
        });
    }
});