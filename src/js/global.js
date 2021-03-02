const DEBUG = true;

const xpath = function(xml, xpath) {
    let result = [];
    let values = xml.evaluate(
        xpath,
        xml,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    for (let i = 0; i < values.snapshotLength; i++) {
        result.push(values.snapshotItem(i));
    }
    return result;
};

const debug = function(obj1, obj2) {
    if (DEBUG) {
        console.log(obj1);
        console.log(obj2);
    }
};
