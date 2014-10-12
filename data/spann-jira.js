/**
 * Created by sunil on 12-10-2014.
 */

$(function(){

    setTimeout(function(){
        process()
    }, 10000)

});


function process() {
    var str = $(document).xpath(".//*[@id='issuetable']/tbody/tr/td[3]").html();
    alert(str)
}