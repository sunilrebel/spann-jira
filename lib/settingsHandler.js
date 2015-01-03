/**
 * Created by sunil on 12/25/2014.
 */
var ss = require('sdk/simple-storage');

exports.getSettings = function () {
    var settings = ss.storage.appSettings;
    if (settings == undefined) {
        settings = {
            userInputRequired: false,
            numberOfJiraToProcessTogether: 5,
            isEnabled: true,
            baseJiraUrl: "",
            customFields: []
        };
        ss.storage.appSettings = settings;
    }
    return settings;
};

exports.saveSettings = function (settings) {
    ss.storage.appSettings = settings;
};

exports.saveBasicSettings = function (basicSettings) {
    ss.storage.appSettings.userInputRequired = basicSettings.userInputRequired;
    ss.storage.appSettings.numberOfJiraToProcessTogether = basicSettings.numberOfJiraToProcessTogether;
    ss.storage.appSettings.isEnabled = basicSettings.isEnabled;
    ss.storage.appSettings.baseJiraUrl = basicSettings.baseJiraUrl;

    //console.log("settings: "+JSON.stringify(ss.storage.appSettings));
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