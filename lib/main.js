/* Main JS Add on File */

/**
 * namespace: SpannJira
 * Author: Sunil
 */
var controllers = require('controllers');
var initializer = require('initializer');

initializer.default();
/*

https://jira.mongodb.org/browse/SERVER-9597
https://jira.mongodb.org/browse/SERVER-1668
https://jira.mongodb.org/browse/SERVER-9397
https://jira.mongodb.org/browse/SERVER-668
https://jira.mongodb.org/browse/SERVER-297
https://jira.mongodb.org/browse/SERVER-168

https://jira.mongodb.org/issues/?jql=text%20~%20%22mongo%22
https://jira.mongodb.org/issues/?jql=project%20%3D%20CASBAH%20AND%20issuetype%20in%20%28standardIssueTypes%28%29%2C%20subTaskIssueTypes%28%29%29%20AND%20status%20%3D%20Closed
https://jira.mongodb.org/browse/CASBAH-113?jql=project%20%3D%20CASBAH%20AND%20issuetype%20in%20%28standardIssueTypes%28%29%2C%20subTaskIssueTypes%28%29%29%20AND%20status%20%3D%20Resolved
https://jira.mongodb.org/browse/SERVER-11570?jql=project%20in%20%28SERVER%2C%20TOOLS%2C%20PHP%2C%20DOCS%2C%20JAVA%29%20AND%20issuetype%20in%20standardIssueTypes%28%29%20AND%20status%20%3D%20Resolved%20AND%20text%20~%20mongo
https://jira.mongodb.org/issues/?jql=project%20in%20%28SERVER%2C%20TOOLS%2C%20PHP%2C%20DOCS%2C%20JAVA%29%20AND%20issuetype%20in%20standardIssueTypes%28%29%20AND%20status%20%3D%20Resolved%20AND%20text%20~%20mongo

*/