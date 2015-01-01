/**
 * Created by sunil on 1/1/2015.
 */

function getElementByXpath (path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function closeTab() {
    self.port.emit('closeTab');
}

function generateIdFromText(text) {
    return text.replace(/[^\w]/gi, '');
}