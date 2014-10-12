/* Main JS Add on File */

/**
 * Global variables
 * @type {exports}
 */
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var data = self.data;


pageMod.PageMod({
    include: /.*jira.*/,
    contentScriptFile: [
        data.url("jquery-2.1.1.min.js"),
        data.url("spann-jira.js")
    ]
});