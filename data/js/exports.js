/**
 * Created by skuma28 on 12/26/2014.
 */
    
var metaHtml = '<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>';
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
    return function(table, filename, sheetName) {
        if (!table.nodeType) table = document.getElementById(table);
        var ctx = {worksheet: sheetName || 'Worksheet', table: table.innerHTML};
        var anchorHtml = '<a id="spannJiraExportAnchor" download="'+filename+'.xls" href="'+uri + base64(format(template, ctx))+'" style="display: block">myanchor</a>';
        $('body').append(anchorHtml);
        $("#spannJiraExportAnchor")[0].click();
    }
})();

function addTableAndExportToExcel(tableHtml) {
    console.log('tableHTML: '+tableHtml);
    $('head').append(metaHtml);
    $('body').append(tableHtml);
    tableToExcel("spannJiraExportTable", "Spann Jira Exports", "Spann Jira Exports");
}