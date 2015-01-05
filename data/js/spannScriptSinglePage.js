/**
 * Created by sunil on 12-10-2014.
 */

var appSettings;

/* on page load */
$(function () {
    self.port.emit('getSettings');
});
/* on page load */

/* listeners */
self.port.on('settings', function (settings) {
    appSettings = settings;
});
self.port.on('startProcessing', function () {
    process();
});
self.port.on('exportToExcel', function (tableHtml) {
    addTableAndExportToExcel(tableHtml);
});
/* listeners */

function process() {
    addFieldsToPage(appSettings);
    if (!appSettings.userInputRequired) {
        saveJira();
    }
}

function saveJira() {
    var extractedData = jiraDataExtractor.getData();
    processingComplete(extractedData);
    closeTab();
}

function addFieldsToPage(settings) {
    if (settings.customFields.length > 0) {
        addSpannJiraSection();
    }
    addSaveJiraButton();
    var sectionHtml = '';
    var fieldCounter = 1;
    for (var i in settings.customFields) {
        var field = settings.customFields[i];

        if (field.isEnabled) {
            var isRight = (fieldCounter % 2 === 0);
            var inputHtml = getInputFieldHtml(field, isRight);
            sectionHtml += inputHtml;
            fieldCounter++;
        }
    }
    $("div#spannCustomFields ul#customFields").html(sectionHtml);
}

function getInputFieldHtml(field, isRight) {
    /* dummy li element html to be added
     '<li class="item">' +
     '<div class="wrap">' +
     '<strong class="name">Display Field</strong>' +
     '<span id="field-val" class="value">' +
     '<input type="text" name="hello">' +
     '</span>' +
     '</div>' +
     '</li>'
     */
    var inputHtml = "";
    var rightClass = (isRight) ? 'item-right' : '';

    switch (field.type) {
        case "text" :
            if (field.valueRegex) {
                var bodyHtml = document.getElementsByTagName('body')[0].innerHTML;
                var valueExtracted = bodyHtml.match(new RegExp(field.valueRegex, "g"));
                if (!valueExtracted) {
                    valueExtracted = '';
                }
                inputHtml = '<input class="spannValue" type="text" id="' + field.id + '" value="' + valueExtracted.toString() + '" style="width: 90%;" />';
            } else {
                inputHtml = '<input class="spannValue" type="text" id="' + field.id + '" value="' + field.defaultValue + '" style="width: 90%;" />';
            }
            break;

        case "select" :
            inputHtml = '<select class="spannValue" id="' + field.id + '" style="width: 125px;">';
            for (var i in field.defaultValue)
                inputHtml += '<option value="' + generateIdFromText(field.defaultValue[i]) + '">' + field.defaultValue[i] + '</option>';
            inputHtml += '</select>';
            break;
    }

    var liHtml =
        '<li class="item ' + rightClass + '">' +
        '<div class="wrap">' +
        '<strong class="name">' + field.displayName + ':</strong>' +
        '<span id="field-val" class="value">' +
        inputHtml +
        '</span>' +
        '</div>' +
        '</li>';

    return liHtml;
}

function addSpannJiraSection() {
    var headingHtml =
        '<div id="spannCustomFields" class="module toggle-wrap">' +
        '<div class="mod-header" id="spannCustomFields-module_heading">' +
        '<ul class="ops"></ul>' +
        '<h2 class="toggle-title">Spann Fields</h2>' +
        '</div>' +
        '<div class="mod-content">' +
        '<ul id="customFields" class="property-list two-cols">' +
        '</ul>' +
        '</div>' +
        '</div>';

    $("div.aui-item.issue-main-column").prepend(headingHtml);
}

function addSaveJiraButton() {
    var saveButtonHtml =
        '<li class="toolbar-item">' +
        '<a href="#" class="toolbar-trigger issueaction-greenhopper-rapidboard-operation js-rapidboard-operation-issue" title="Save Jira Details" id="spann-save">' +
        '<span class="trigger-label">Save</span>' +
        '</a>' +
        '</li>';

    $("div.toolbar-split.toolbar-split-left ul:first").append(saveButtonHtml);

    $("a#spann-save").click(function () {
        saveJira();
    });
}

function processingComplete(jiraData) {
    self.port.emit('processingComplete', {
        jiraData: jiraData,
        baseUrl: fetchBaseUrl()
    });
}

function fetchBaseUrl() {
    var url = window.location.toString();
    var baseUrl = url.substring(0, url.indexOf("browse"));
    return baseUrl;
}