/* Main JS Add on File */

/**
 * namespace: SpannJira
 * Author: Sunil
 */
var SpannJira = {};

var controllers = require('controllers');
var initializer = require('initializer');
var listeners = require('listeners');
var settingsHandler = require('settingsHandler');
var storageSystem = require('storageSystem');
var uiHandler = require('uiHandler');

SpannJira.controllers = controllers;
SpannJira.init = initializer;
SpannJira.listeners = listeners;
SpannJira.settings = settingsHandler;
SpannJira.storageSystem = storageSystem;
SpannJira.ui = uiHandler;

SpannJira.init.default();
SpannJira.controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-9597"});
//SpannJira.controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-1668"});