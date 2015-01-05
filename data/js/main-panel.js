/**
 * Created by sunil on 16-11-2014.
 */

var customFieldCounter = 1;

/* self port listeners */
self.port.on('removedCustomField', function (data) {
    var parentId = data.parentId;
    $('#' + parentId).remove();
});

self.port.on('settings', function (settings) {
    updateBasicSettings(settings);
    var customFields = settings.customFields;
    for (var i in customFields) {
        addCustomField(customFields[i]);
    }
});

self.port.on('exportToExcel', function (tableHtml) {
    addTableAndExportToExcel(tableHtml);
});
/* self port listeners */
(function ($) {
    $.fn.disableSelection = function () {
        return this
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };
})(jQuery);

$('div.menu').disableSelection();

$("#enableSpannJira, #userInputRequired").change(function () {
    if (validateSettings()) {
        saveSettings();
    }
});

$("#numberOfJiraToProcessTogether, #baseJiraUrl").keyup(function () {
    if (validateSettings()) {
        saveSettings();
    }
});

/* adding tabs click functionality */
$('div.menu li').each(function () {
    $(this).click(function () {
        var text = $(this).text().trim().toLowerCase();
        $('div.menu li').removeClass('active');
        $(this).addClass('active');
        $('div#content div.tab').each(function () {
            $(this).addClass('hidden');
        });
        $('div#' + text).removeClass('hidden');
    });
});

/* adding input -start processing event */
$("#startProcessing").click(function () {
    var textArea = $("#inputForm textarea[name=inputUrl]");
    var input = textArea.val();
    self.port.emit('startProcessing', input);
});

$("#exportResults").click(function() {
    self.port.emit('exportToExcel');
});

/* accordion heading click event */
$("#accordion a.heading").on('click', function (e) {
    e.preventDefault();
    var a = $(this).attr("href");
    $(a).slideDown('fast');
    $("#accordion div.section").not(a).slideUp('fast');
});

$("#addNewField:first").on("click", function () {
    addCustomField();
});

function addCustomField(singleField) {
    var newFieldHtml = "";
    if (singleField !== undefined) {
        var textSelected = "";
        var selectSelected = "";
        if (singleField.type === "text") {
            textSelected = "selected";
        } else if (singleField.type === "select") {
            selectSelected = "selected";
        }

        var checkBoxChecked = "";
        if (singleField.isEnabled) {
            checkBoxChecked = "checked";
        }

        if (Number(singleField.id) > customFieldCounter) {
            customFieldCounter = Number(singleField.id);
        }

        newFieldHtml =
            '<div class="row-field" id="customField' + singleField.id + '">' +
            '<input type="checkbox" id="isEnabled" ' + checkBoxChecked + '/>' +
            '<input type="text" id="displayName" placeholder="Field Name" value="' + singleField.displayName + '" />' +
            '<select id="type"><option ' + textSelected + '>text</option><option ' + selectSelected + '>select</option></select>' +
            '<input type="text" id="defaultValue" placeholder="Default Value" value="' + singleField.defaultValue + '">' +
            '<a href="#" id="remove"><img src="../images/open29.png" /></a>' +
            '</div>';
    } else {
        newFieldHtml =
            '<div class="row-field" id="customField' + customFieldCounter + '">' +
            '<input type="checkbox" id="isEnabled" />' +
            '<input type="text" id="displayName" placeholder="Field Name" />' +
            '<select id="type"><option>text</option><option>select</option></select>' +
            '<input type="text" id="defaultValue" placeholder="Default Value">' +
            '<input type="checkbox" id="useRegEx" />' +
            '<a href="#" id="remove"><img src="../images/open29.png" /></a>' +
            '</div>';
    }

    $("div#fields").prepend(newFieldHtml);

    $("#customField" + customFieldCounter + " #isEnabled").change(function () {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $("#customField" + customFieldCounter + " #displayName").keyup(function () {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $("#customField" + customFieldCounter + " #type:first").change(function () {
        var value = $(this).val();
        if (value === 'text') {
            $(this).next('input').attr('placeholder', 'Default Value');
        } else if (value === 'select') {
            $(this).next('input').attr('placeholder', 'comma delimited');
        }
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $('#customField' + customFieldCounter + ' #defaultValue').keyup(function () {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $('#customField' + customFieldCounter + ' #useRegEx').change(function () {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $("#customField" + customFieldCounter + " #remove:first").click(function () {
        removeCustomField($(this).parent());
    });

    customFieldCounter++;
}

function updateBasicSettings(settings) {
    $("#enableSpannJira").prop('checked', settings.isEnabled);
    $("#userInputRequired").prop('checked', settings.userInputRequired);
    $("#numberOfJiraToProcessTogether").val(settings.numberOfJiraToProcessTogether);
    $("#baseJiraUrl").val(settings.baseJiraUrl);
}

function validateCustomFieldData(parent) {
    return true;
}

function validateSettings() {
    var errorMsgElement = $("#error").first();
    errorMsgElement.text("");

    var jiraToProcessTogether = $("#numberOfJiraToProcessTogether").val();
    var baseJiraUrl = $("#baseJiraUrl").val();
    if (jiraToProcessTogether.length > 0) {
        if (!/^[\d+]{1,3}$/.test(jiraToProcessTogether) || Number(jiraToProcessTogether) === 0) {
            errorMsgElement.text("Limit is 1-999 for Jira to process together");
            return false;
        }
    } else if (baseJiraUrl.length > 0) {
        if (!/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(baseJiraUrl)) {
            errorMsgElement.text("Base url is not valid");
            return false;
        }
    }
    return true;
}

function saveCustomField(parent) {
    var customFieldId = parent.attr('id').replace(/[^\d]+/i, '');

    var displayName = parent.find('input#displayName').val();
    var type = parent.find('select#type').val();
    var isEnabled = parent.find('input#isEnabled').is(':checked');
    var defaultValue = null;
    var valueRegex = null;
    var useRegEx = parent.find('input#useRegEx').is(':checked');
    if (useRegEx) {
        valueRegex = parent.find('input#defaultValue').val();
    } else {
        defaultValue = parent.find('input#defaultValue').val();
    }
    if (type === "select") {
        defaultValue = defaultValue.split(",");
    }
    var data = {
        id: customFieldId,
        displayName: displayName,
        type: type,
        valueRegex: valueRegex,
        defaultValue: defaultValue,
        isEnabled: isEnabled
    };
    self.port.emit('saveCustomField', data);
}

function saveSettings() {
    var enableSpannJira = $("#enableSpannJira").is(':checked');
    var userInputRequired = $("#userInputRequired").is(':checked');
    var jiraToProcessTogether = $("#numberOfJiraToProcessTogether").val();
    var baseJiraUrl = $("#baseJiraUrl").val();

    var settings = {
        isEnabled: enableSpannJira,
        numberOfJiraToProcessTogether: Number(jiraToProcessTogether),
        userInputRequired: userInputRequired,
        baseJiraUrl: baseJiraUrl
    };

    self.port.emit('saveSettings', settings);
}

function removeCustomField(parent) {
    var data = {
        parentId: parent.attr('id')
    };
    self.port.emit('removeCustomField', data);
}
self.port.emit('getSettings');