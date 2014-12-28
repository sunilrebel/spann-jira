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

initializer.default();
//controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-9597"});
//controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-1668"});
//controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-9397"});
//controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-668"});
//controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-297"});
//controllers.pageController("start", {url:"https://jira.mongodb.org/browse/SERVER-168"});

//controllers.listController('start', {url:'https://jira.mongodb.org/issues/?jql=text%20~%20%22mongo%22'});
//controllers.listController('start', {url:'https://jira.mongodb.org/issues/?jql=project%20%3D%20CASBAH%20AND%20issuetype%20in%20%28standardIssueTypes%28%29%2C%20subTaskIssueTypes%28%29%29%20AND%20status%20%3D%20Closed'});
//controllers.listController('start', {url:'https://jira.mongodb.org/browse/SERVER-11570?jql=project%20in%20%28SERVER%2C%20TOOLS%2C%20PHP%2C%20DOCS%2C%20JAVA%29%20AND%20issuetype%20in%20standardIssueTypes%28%29%20AND%20status%20%3D%20Resolved%20AND%20text%20~%20mongo'});
//controllers.listController('start', {url:'https://jira.mongodb.org/issues/?jql=project%20in%20%28SERVER%2C%20TOOLS%2C%20PHP%2C%20DOCS%2C%20JAVA%29%20AND%20issuetype%20in%20standardIssueTypes%28%29%20AND%20status%20%3D%20Resolved%20AND%20text%20~%20mongo'});