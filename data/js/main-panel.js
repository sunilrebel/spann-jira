/**
 * Created by sunil on 16-11-2014.
 */

var customFieldCounter = 1;

/* self port listeners */
self.port.on('removedCustomField', function(data) {
    var parentId = data.parentId;
    $('#'+parentId).remove();
});
/* self port listeners */
(function($){
    $.fn.disableSelection = function() {
        return this
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };
})(jQuery);

$('div.menu').disableSelection();

/* adding tabs click functionality */
$('div.menu li').each(function () {
    $(this).click(function () {
        var text = $(this).text().trim().toLowerCase();
        $('div.menu li').removeClass('active');
        $(this).addClass('active');
        $('div#content div.tab').each(function(){
            $(this).addClass('hidden');
        });
        $('div#' + text).removeClass('hidden');
    });
});

/* adding input -start processing event */
$("#startProcessing").click(function() {
    var textArea = $("#inputForm textarea[name=inputUrl]");
    var input = textArea.val();
    self.port.emit('startProcessing',input);
});

/* accordion heading click event */
$("#accordion a.heading").on('click', function(e) {
    e.preventDefault();
    var a = $(this).attr("href");
    $(a).slideDown('fast');
    $("#accordion div.section").not(a).slideUp('fast');
});

$("#addNewField:first").on("click", function() {
    var newFieldHtml =
        '<div class="row-field" id="customField'+customFieldCounter+'">' +
            '<input type="checkbox" id="isEnabled" />' +
            '<input type="text" id="displayName" placeholder="Field Name" />' +
            '<select id="type"></option><option>text</option><option>select</option></select>' +
            '<input type="text" id="defaultValue" placeholder="Default Value">' +
            '<a href="#" id="remove"><img src="../images/open29.png" /></a>' +
        '</div>';

    $("div#fields").prepend(newFieldHtml);

    $("#customField"+customFieldCounter+" #isEnabled").change(function() {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $("#customField"+customFieldCounter+" #displayName").keyup(function() {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $("#customField"+customFieldCounter+" #type:first").change(function() {
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

    $('#customField'+customFieldCounter+' #defaultValue').keyup(function() {
        if (validateCustomFieldData($(this).parent())) {
            saveCustomField($(this).parent());
        }
    });

    $("#customField"+customFieldCounter+" #remove:first").click(function() {
        removeCustomField($(this).parent());
    });

    customFieldCounter++;
});

function validateCustomFieldData(parent) {
    return true;
}

function saveCustomField(parent) {
    var customFieldId = parent.attr('id').replace(/[^\d]+/i,'');

    var displayName = parent.find('input#displayName').val();
    var type = parent.find('select#type').val();
    var isEnabled = parent.find('input#isEnabled').is(':checked');
    var defaultValue = parent.find('input#defaultValue').val();
    if (type === "select") {
        defaultValue = defaultValue.split(",");
    }
    var data = {
        id: customFieldId+'-val',
        displayName: displayName,
        type: type,
        valueRegex: null,
        valueXPath: null,
        defaultValue: defaultValue,
        isEnabled: isEnabled
    };
    self.port.emit('saveCustomField', data);
}

function removeCustomField(parent) {
    var data = {
        parentId: parent.attr('id')
    };
    self.port.emit('removeCustomField', data);
}