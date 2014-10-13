/**
 * Created by sunil on 12-10-2014.
 */

$(function(){

    setTimeout(function(){
        process()
    }, 10000)

});


function process() {
    var items=[];
    $('#issuetable').find('tbody tr td:nth-child(2)').each( function(){
        items.push( "https://jira.mongodb.org/browse/"+$(this).text() );
    });
    items = $.unique( items );
    $.each( items, function(i, item){
        if(i<4) {
            console.log(item)
        }
    })
}