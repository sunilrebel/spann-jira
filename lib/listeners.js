/**
 * Created by skuma28 on 12/25/2014.
 */

var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var data = self.data;

pageMod.PageMod({
    include: /.*jira.*browse\/.*/,
    contentScriptFile: [
        data.url("jquery-2.1.1.min.js"),
        data.url("spann-jira.js")
    ]
});