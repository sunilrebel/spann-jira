/**
 * Created by sunil on 16-11-2014.
 */

var customFieldCounter = 1;

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
            '<input type="text" id="displayName" placeholder="Field Name" />' +
            '<select id="type"></option><option>text</option><option>select</option></select>' +
            '<input type="text" id="defaultValue" placeholder="Default Value">' +
            '<span href="#" id="remove">r</span>' +
        '</div>';

    $("div#fields").prepend(newFieldHtml);

    $("#customField"+customFieldCounter+" #type:first").change(function() {
        var value = $(this).val();
        if (value === 'text') {
            $(this).next('input').attr('placeholder', 'Default Value');
        } else if (value === 'select') {
            $(this).next('input').attr('placeholder', 'comma delimited');
        }
    });

    $("#customField"+customFieldCounter+" #remove:first").click(function() {
        console.log("added");
        console.log("html: "+$(this).parent().html());
        $(this).parent().remove();
    });

    customFieldCounter++;
});