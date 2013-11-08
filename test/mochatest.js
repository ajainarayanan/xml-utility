
var xmlutil = (typeof window === "undefined")? require(".."):  require("xml-util");
var assert = require("assert");

describe("rule-converter", function() {
  var xmlconverter,
      xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><root><childNode1 attr1='attribute1'>ChildNode" +
          "</childNode1><childNode1 attr2='attribute2'>ChildNode2</childNode1></root>";
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
                    },
                    {
                        name: "childNode1",
                        value: "ChildNode2",
                        attributes: {
                            "attr2": "attribute2"
                        },
                        children: []
                    }
                ]
         };

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
        },
        {
            name: "childNode1",
            value: "ChildNode2",
            attributes: {
              "attr2": "attribute2"
            },
            children: []
        }],
        actual = xmlconverter.find("childNode1");
        console.log(expected, " ===> ", actual)
        assert( JSON.stringify(expected) == JSON.stringify(actual));
    });
    it("Access based on property", function() {
        var expected = [ {
            name: "childNode1",
            value: "ChildNode",
            attributes: {
                "attr1": "attribute1"
            },
            children: []
        }],
        actual = xmlconverter.find("childNode1[attr1=attribute1]");
        console.log(expected, " ===> ", actual)
        assert( JSON.stringify(expected) == JSON.stringify(actual));

    });
});
