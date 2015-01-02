/**
 * Created by sunil on 12/25/2014.
 */
var ss = require('sdk/simple-storage');

exports.getSettings = function () {
    var settings = ss.storage.appSettings;
    if (settings == undefined) {
        settings = {
            userInputRequired: true,
            numberOfJiraToProcessTogether: 5,
            customFields: []
        }
    }
    return settings;
};

exports.saveSettings = function (settings) {
    ss.storage.appSettings = settings;
};

exports.saveCustomField = function (params) {
    var settings = exports.getSettings();
    var found = false;
    for (var i in settings.customFields) {
        if (settings.customFields[i].id == params.data.id) {
            found = true;
            settings.customFields[i] = params.data;
            break;
        }
    }
    if (!found) {
        settings.customFields.push(params.data);
    }
    exports.saveSettings(settings);
};

exports.removeCustomField = function (params) {
    params.mainPanel.port.emit('removedCustomField', params.data);
};