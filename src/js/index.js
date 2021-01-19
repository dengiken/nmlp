let nmlp = {
    book: "",
    scene: "",
    sequence: "",
    shot: "",
    partData: {},
    cursor: 0,
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
        //console.log(this.scene);

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
            //let result = this.xpath(data, "/shot/part/caption");
            //let result = this.xpath(data, "/sequence/scene[1]/item");
            //console.log(result);
            this.setScene(data, 1);
            this.setShot(data, 1, 1);
            this.getPart(data, 1, 1, 1);
            this.showCaption();
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
    },
    setScene: (data, sceneIndex) => {
        let bg = nmlp.xpath(data, "/sequence/scene[" + sceneIndex + "]/item");
        for(let i in bg) {
            nmlp.setImage(bg[i], "background");
        }
    },
    setShot: (data, sceneIndex, shotIndex) => {
        let fg = nmlp.xpath(data, "/sequence/scene[" + sceneIndex + "]/shot[" + shotIndex + "]/item");
        for(let i in fg) {
            nmlp.setImage(fg[i], "foreground");
        }
    },
    getPart: (data, sceneIndex, shotIndex, partIndex) => {
        nmlp.partData = nmlp.xpath(data, "/sequence/scene[" + sceneIndex + "]/shot[" + shotIndex + "]/part[" + partIndex + "]")[0];
    },
    setImage: (obj, layer) => {
        let fileName = $(obj).attr("file");
        if (!fileName) {
            return false;
        }
        //console.log("nmlp-lib/resources/" + nmlp.book + "/" + fileName);
        fileName = "nmlp-lib/resources/" + nmlp.book + "/" + fileName;
        if ($(obj).attr("fullscreen") == "true") {
            $("#" + layer).css({
                backgroundImage: "url(" + fileName + ")"
            });
        } else {
            $("#" + layer).append(
                "<img src=\"" + fileName + "\">"
            );
        }
    },
    showCaption: function() {
        let row = this.xpath(this.partData, "/*");
        console.log(this.partData);
    }
};

nmlp.init();
