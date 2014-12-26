/**
 * Created by skuma28 on 12/25/2014.
 */

var controllers = require('controllers');
var storageSystem = require('storageSystem');

var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var data = self.data;

pageMod.PageMod({
    include: /.*jira.*browse\/.*/,
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
            controllers.exportController('exportToExcel', {
                worker: worker
            });
        });
    }
});