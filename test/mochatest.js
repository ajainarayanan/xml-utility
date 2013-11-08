
var xmlutil = (typeof window === "undefined")? require(".."):  require("xml-util");
var assert = require("assert");

describe("rule-converter", function() {
  var xmlconverter,
      xmlString = "?xml version=\"1.0\" encoding=\"UTF-8\" ?><root><childNode1 attr1='attribute1'>ChildNode</childNode1></root>";
  xmlconverter = xmlutil(xmlString);
  it("Basic xml utility", function() {
	json = {
        	name: "root",
        	value: "",
	        attributes: {},
	        children: [
        	    {
                	name: "childNode1",
	                value: "ChildNode",
        	        attributes: {
                	    "attr1": "attribute1"
	                },
        	        children: []
	            }
        	]
   	 };
      console.log(xmlconverter);
    var a = JSON.stringify(xmlconverter.xmlJson),
	b = JSON.stringify(json);
    assert(a == b);
  });
  it("Basic Query utility", function() {
      var expected = [ {
            name: "childNode1",
            value: "ChildNode",
            attributes: {
                "attr1": "attribute1"
            },
            children: []
        }],
        actual = xmlconverterd.find("childNode1");

      assert( expected != actual);
  });
});
