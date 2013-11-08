module.exports = xmlUtil;

Object.query = function (a) {
    'use strict';
    if (a === null || typeof a === 'undefined') {
        return null;
    }
    for (var _ = 1; _ < arguments.length; _++) {
        var c = arguments[_];
        a = a[c];
        if (a === null || typeof a === 'undefined') {
            return null;
        }
    }
    return a;
};

function xmlUtil(xmlString) {
    this.xmlString = xmlString;
    // Frak IE8.Now everything supports window.DOMPARSER
    this.xml = xmlString;
    var domParser = new DOMParser();
    this.xmlDoc = domParser.parseFromString(this.xml, "text/xml");
    this.xmlJson = this.xmlToJson(this.xmlDoc.childNodes[0]);
}

xmlUtil.prototype.xmlToJson = function(node) {
    /*
        -> Tag node name make it as key
        -> Create @attributes object.
            Put all attributes of the node inside the @attributes map
        -> value contains the text of the node (if any)
        -> create children object.
        -> children are the same as this object.
        I/P:
            <node1 attr1="attr1" dsType="something">
                <somenode attr2="attr2" dsType="somethingElse">
                    Some Random value
                </somenode>
            </node1>
        O/P:
            [
                {
                    attributes:{
                        "attr1": "attr1",
                        "dsType": "something"
                    },
                    value: "",
                    name: "node1"
                    children: [
                        {
                            attributes: {
                                "attr2": "attr2",
                                "dsType": "somethingelse"
                            },
                            value: "Some Random Value",
                            name: "somenode",
                            children:[]
                        }
                    ]
                }
            ]
     */

    var attrCount = node.attributes.length,
        childCount = node.childElementCount,
        name = node.nodeName,
        value = Object.query(node, "childNodes", 0, "nodeValue") || "",
        children = [],
        attributes= {};

    if(childCount > 0) {
        var i,length = childCount;
        for( i=0; i< length; i++) {
            children.push(this.xmlToJson(node.childNodes[i]));
        }
    }
    if(attrCount > 0) {
        var j, len = attrCount;
        for(j=0; j<len; j++) {
            attributes[node.attributes[j].nodeName] = node.attributes[j].nodeValue;
        }
    }
    return {
        "name": name,
        "value": value,
        "attributes": attributes,
        "children": children
    };
}


/*
 Usage:
     xmlUtil.query(<jsObject>, [nodeNames, ... ]);
     xmlUtil.query(<jsObject> , "Condition", "Predicate");
     xmlUtil.query(<jsObject>, "Condition", "Predicate", "Predicate", "Predicate", "BinaryTextOperator");  Yeah this is how xml is in utopia.
     Nice To have:
        xmlUtil.query(<jsObject>, "Condition[attr1=value]");
     If no <jsObject> is passed in then the parsing starts from root of the xmlJson.
     xmlUtil.query("Condition");

 */
xmlUtil.prototype.find = function(a) {
    //From Object.query
    "use strict";

    if(a === null || typeof a === 'undefined') {
        return null;
    }
    var length = arguments.length,
        node = [],
        i;
    if(typeof a === "object"){
        node = [a];
        i=1;
    } else{
        node = [this.xmlJson];
        i=0;
    }
    for( ; i< length; i++) {
        var args = arguments[i],
            param = args.match(/\[(.*?)\]/),
            name,
            attr = null,
            attrName, attrValue;
        if(param) {
            name = args.match(/[^\[\]]*/)[0];
            attr = args.substring(args.indexOf("[") + 1, args.indexOf("]")).split("=");
            attrName = attr[0];
            attrValue = attr[1];
        } else {
            name = arguments[i];
        }
        node = this.findMatchingChild(node[0], name, attrName, attrValue );
        if(node.length === 0) {
            break;
        }
        if(node.length > 0 && i+1 === length) {
            return node;
        } else {
            return null;
        }
    }
    return node;
}

xmlUtil.prototype.findMatchingChild = function(node, name, attrName, attrValue) {
    var children = node.children,
        matchingChild = [],
        /* Couldn't find any more readable way of writing code. Will modify */
        stateTable = {
            true: {
                false: "nameAloneValid",
                true: "checkForAttr"
            },
            false: {
                false: "noop",
                true: "noop"
            }
        };

    if(children.length > 0) {
        var i,
            len = children.length;
        for(i =0; i< len; i++) {
            var isAttr = (attrName && attrValue)? true: false,
                isName = (Object.query(children, i, "name") === name);
            var result = stateTable[isName][isAttr];
            if(result === "nameAloneValid") {
                matchingChild.push(Object.query(children, i));
            } else if (result === "checkForAttr") {
                if(Object.query(children, i, "attributes")[attrName] === attrValue) {
                    matchingChild.push(Object.query(children, i));
                }
            }
        }
    }
    return matchingChild;
}