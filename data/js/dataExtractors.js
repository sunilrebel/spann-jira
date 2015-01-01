/**
 * Created by sunil on 12/25/2014.
 */

var jiraDataExtractor = {
    data: {},
    getData: function() {
        this.data.id = $("#key-val").text();
        this.data.url = window.location.href;
        this.data.status = $("#status-val").text();
        this.data.resolution = $("#resolution-val").text();
        this.data.assignee = $("#assignee-val").text();

        var data = this.data; // proxy for jquery each, cannot use this.data
        /* extract custom field values */
        $("div#spannCustomFields div.mod-content ul:first li").each(function() {
            var key = $(this).find('strong.name').text().replace(":","");
            var value = $(this).find('.spannValue').val();
            data[key] = value;
        });

        this.data = this.trimData(this.data);
        return this.data;
    },
    trimData: function(data) {
        var result = {};
        $.each(data, function(key, value) {
            result[key] = value.trim();
        });
        return result;
    }
};

var jiraListExtractor = {
    jiraList: [],
    startJiraListExtraction: function(message, callback) {
        if( $("div.split-view").length > 0 ) {
            this.extractJiraListSplitView(callback);
        } else if( $("div.list-view").length > 0 ) {
            this.extractJiraListListView(callback);
        }
    },
    extractJiraListSplitView: function (callback) {
        var jiraElementSelector = 'div.split-view .issue-list li';
        var attributeSelector = 'data-key';

        this.extractAndProcessJiraList(jiraElementSelector, attributeSelector, callback);
    },
    extractJiraListListView: function(callback) {
        var jiraElementSelector = 'div.list-view table#issuetable tr';
        var attributeSelector = 'data-issuekey';

        this.extractAndProcessJiraList(jiraElementSelector, attributeSelector, callback);
    },
    extractAndProcessJiraList: function(jiraElementSelector, attributeSelector, callback) {
        var jiraList = [];

        var navigationSelector = 'div.pagination a.icon-next';
        var lastPageNumber;
        var processJiraList = this.processJiraList; // variable acting as a proxy otherwise
        var validateJiraId = this.validateJiraId;   // this.anything will be acting in setTimeout scope as it's element

        /* using interval for page navigation */
        var timer = setInterval(function() {

            var currentPageNumber = $('div.pagination strong').text().trim();
            if(currentPageNumber != lastPageNumber) {
                /* new page has loaded */

                $(jiraElementSelector).each(function() {
                    var jiraId = $(this).attr(attributeSelector);
                    if (validateJiraId(jiraId))
                        jiraList.push(jiraId);
                });

                if ($(navigationSelector).length < 1) {
                    /* 'next' button is not present in navigation */

                    if($('div.pagination strong').index() > $('div.pagination a:last').index()) {
                        /* bold page number element is at the last position, means we've navigated all of the pages */
                        clearInterval(timer);
                    }
                    this.jiraList = jiraList;
                    processJiraList(callback);
                } else {
                    /* found 'next' button in pagination, so click it */
                    $(navigationSelector)[0].click();
                }
                lastPageNumber = currentPageNumber;
            }
        }, 500);

        return jiraList;
    },
    validateJiraId: function(jiraId) {
        var regex = new RegExp("^[a-zA-z]+-[\\d]+$");
        return regex.test(jiraId);
    },
    processJiraList: function(callback) {
        console.log("Total # of jira found are : "+this.jiraList.length);
        callback(this.jiraList);
    },
    trimData: function(jiraList) {
        var result = [];
        for(var i in jiraList) {
            result.push(jiraList[i].trim());
        }
        return result;
    }
};