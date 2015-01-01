/**
 * Created by sunil on 16-11-2014.
 */

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
$("#accordion a").on('click', function(e) {
    e.preventDefault();
    var a = $(this).attr("href");
    $(a).slideDown('fast');
    $("#accordion div.section").not(a).slideUp('fast');
});

/*var newFieldHtml =
 '<div class="row-field" id="customField1">' +
 '<input type="text" id="displayName" placeholder="Field Name" />' +
 '<select id="type"></option><option>text</option><option>select</option></select>' +
 '<input type="text" id="defaultValue" placeholder="Default Value">' +
 '<span href="#" id="Remove">r</span>' +
 '</div>';

 $("div#fields").prepend(newFieldHtml);*/