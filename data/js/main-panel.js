/**
 * Created by sunil on 16-11-2014.
 */

var extractButton = document.querySelector("#extractButton");
var userInput = document.querySelector("#userInput");

extractButton.addEventListener('click', function onclick(event) {
    var input = userInput.value;
    input = "https://jira.mongodb.org/issues/?jql=text%20~%20%22mongo%22";
    self.port.emit("extractData", input);
});