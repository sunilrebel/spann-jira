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
        
        this.trimData();
        return this.data;
    },
    trimData: function() {
        var result = {};
        $.each(this.data, function(key, value) {
            result[key] = value.trim(); 
        });
        this.data = result;
    }
};