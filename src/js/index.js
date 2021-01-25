const DEBUG = true;

class Nmlp {
    book = "";
    scene = "";
    sceneData = "";
    cursor = 0;
    xml = "";
    client = new Client();

    constructor() {
        let _get = location.search.substring(1).split("&").map(
            (p) => p.split("=")
        ).reduce(
            (obj, e) => (
                {...obj, [e[0]]: e[1]}
            ),{}
        );
        this.book = location.search.substring(1).split("&")[0];
        this.scene = _get["scn"] ? _get["scn"] : "";

        this.startScene(this.book, this.scene);
    }

    startScene(book, scene) {
        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "xml",
            data:{
                book: book,
                scene: scene,
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }).done((data) => {
            //debug("readScene", data);
            this.xml = data;
            this.sceneData = xpath(data, "/scene/*");
            this.main();
        })
    }

    main() {
        let $shot = $(this.sceneData[this.cursor]);
        let waiting = true;
        switch($shot.prop("tagName")) {
            case "background":
                this.setBackground($shot);
                break;
            case "image":
                this.setImage($shot);
                waiting = false;
                this.cursor++;
                break;
            case "caption":
                this.setCaption($shot);
                this.cursor++;
                break;
            case "select":
                this.setSelect($shot);
                break;
            case "clear":
                this.clearScreen();
                waiting = false;
                this.cursor++;
                break;
            case "fade":
                this.fade($shot);
                break;
            default :
                waiting = false;
                this.cursor++;
        }

        if (!waiting) {
            this.main();
        }
    }

    setBackground($obj) {
        let fileName = $obj.attr("file");
        if (fileName) {
            fileName = "nmlp-lib/resources/" + this.book + "/" + fileName;
            this._setBg(fileName);
            return true;
        } else {
            return false;
        }
    }

    _setBg(fileName) {
        let img = new Image();
        img.src = fileName;
        img.onload = () => {
            $("#background").css({
                backgroundImage: "url(" + fileName + ")"
            });
            this.cursor++;
            this.main();
        };
    }

    setImage($obj) {
        let x;
        let fileName = $obj.attr("file");
        if (fileName) {
            let $img = $("<img src=\"" + "nmlp-lib/resources/" + this.book + "/" + fileName + "\">");
            if ($obj.attr("x") != "") {
                x = (parseFloat($obj.attr("x")) / 2) + "vw";
            } else {
                x = "0vw";
            }
            //console.log(x);
            $img.css({
                height: "100%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) translate(" + x +", 0)",
            });
            $("#foreground").append($img);
            return true;
        } else {
            return false;
        }
    }

    setCaption($obj) {
        $("#caption").css("display", "block");
        $("#cap_name").html($obj.attr("name"));
        let counter = 1;
        let stepShow = setInterval(function(){
            $("#cap_body").html($obj.text().slice(0, counter + 1));
            if (counter >= $obj.text().length) {
                clearInterval(stepShow);
                $("#cap_next").css("display", "block");
            }
            counter++;
        }, 25);
    }

    setSelect($obj) {
        $obj.children("option").each(function() {
            let $selection = $("<div class=\"option\">" + this.childNodes[0].nodeValue.trim() + "</div>");
            let $script = $(this).children("script");
            $selection.on("click", function(){
                $("#selection").css("display", "none");
                let nml = nmlp.client;
                debug("script", $script.text());
                eval($script.text());
            });

            $("#selection").append($selection);
        });

        $("#cap_next").css("display", "none");
        $("#selection").css("display", "block");
    }

    clearScreen() {
        $("#foreground").children().remove();
    }

    fade($obj) {
        $("#caption").css("display", "none");
        let counter = 0;
        let from = parseInt($obj.attr("from"));
        let times = parseInt($obj.attr("time")) / 50;
        let step = (parseInt($obj.attr("to")) - from) / times;
        let _fade = setInterval(()=>{
            $("#overlay").css({
                backgroundColor: $obj.attr("color") + ("0" + parseInt((from + (step * counter)) * 2.55).toString(16)).slice(-2)
            });
            if (counter >= times) {
                clearInterval(_fade);
                this.cursor++;
                this.main();
            }
            counter++;
        }, 50);
    }
}

class Client {
    args = {};
    getVar(n) {
        return this.args[n];
    }
    setVar(n, v) {
        this.args[n] = v;
    }
    move(id) {
        for(let i in nmlp.sceneData) {
            if ($(nmlp.sceneData[i]).attr("id") == id) {
                nmlp.cursor = i;
                nmlp.main();
                return true;
            }
        }
        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "xml",
            data:{
                book: nmlp.book,
                scene: id,
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }).done((data) => {
            //debug("readScene", data);
            nmlp.xml = data;
            nmlp.sceneData = xpath(data, "/scene/*");
            nmlp.cursor = 0;
            nmlp.main();
        })
    }
}

const debug = function(obj1, obj2) {
    if (DEBUG) {
        console.log(obj1);
        console.log(obj2);
    }
};

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

let nmlp = new Nmlp();

$("#cap_next").on("click", function(e){
    //$("#caption").css("display", "none");
    nmlp.main();
});

