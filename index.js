module.exports = xmlUtil;
var parserUtil = require("./parserUtil");
function xmlUtil(xmlString) {
    return new parserUtil(xmlString);
};