let nmlp = {
    book: "",
    scene: "",
    sequence: "",
    shot: "",
    init: function() {
        _get = location.search.substring(1).split("&").map(
            (p) => p.split("=")
        ).reduce(
            (obj, e) => (
                {...obj, [e[0]]: e[1]}
            ),{}
        );

        this.book = location.search.substring(1).split("&")[0];
        this.sequence = _get["seq"] ? _get["seq"] : "main";
        this.scene = _get["scn"] ? _get["scn"] : "";
        this.shot = _get["sht"] ? _get["sht"] : "";
        console.log(this.scene);

        this.read();
    },
    read: function() {
        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "xml",
            data:{
                book: this.book,
                scene: this.scene,
                sequence: this.sequence,
                shot: this.shot
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }).done((data) => {
            //console.log(data);
            let result = this.xpath(data, "/shot/part/caption");
            //console.log(result);
        })
    },
    xpath: function(xml, xpath) {
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
    }
};

nmlp.init();
