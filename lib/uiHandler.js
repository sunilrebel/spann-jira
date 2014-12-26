/**
 * Created by skuma28 on 12/25/2014.
 */

var tabs = require('sdk/tabs');
var self = require("sdk/self");
var data = self.data;

exports.openTab = function(url) {
    tabs.open(url);
};