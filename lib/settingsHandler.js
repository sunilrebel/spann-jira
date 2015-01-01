/**
 * Created by sunil on 12/25/2014.
 */

exports.getSettings = function () {
    var settings = {
        userInputRequired: true,
        numberOfJiraToProcessTogether: 5,
        customFields: [
            {
                id: "display-val",
                displayName: "display",
                type: "text",
                valueRegex: null,
                valueXPath: null,
                defaultValue: "",
                isEnabled: true
            },
            {
                id: 'field2-val',
                displayName: "field2",
                type: "text",
                valueRegex: "a",
                valueXPath: null,
                defaultValue: "",
                isEnabled: true
            },
            {
                id: 'selectField-val',
                displayName: "MySelect",
                type: "select",
                valueRegex: "a",
                valueXPath: null,
                defaultValue: ['option 1','option 2','option 3'],
                isEnabled: true
            }
        ]
    };
    return settings;
};