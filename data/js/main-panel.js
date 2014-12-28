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