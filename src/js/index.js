const DEBUG = true;

/**
 * @class Nmlp
 * @property {string} book
 * @property {string} scene
 * @property {node[]} sceneData
 * @property {string} cursor
 * @property {xml} xml
 * @property {client} client
 */
class Nmlp {
    book = "";
    scene = "";
    sceneData = "";
    cursor = 0;
    xml = "";
    client = new Client();
    _get = "";

    /**
     * create a nmlp.
     */
    constructor() {
        this._get = location.search.substring(1).split("&").map(
            (p) => p.split("=")
        ).reduce(
            (obj, e) => (
                {...obj, [e[0]]: e[1]}
            ),{}
        );
        this.book = location.search.substring(1).split("&")[0];
        this.scene = this._get["scn"] ? this._get["scn"] : "";

        this.startScene(this.book, this.scene);
    }

    /**
     * Start the scene.
     * @param {string} book
     * @param {string} scene
     */
    startScene(book, scene) {
        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "xml",
            data: {
                book: book,
                scene: scene,
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }).done((data) => {
            //debug("readScene", data);
            this.xml = data;
            this.sceneData = xpath(data, "/scene/*");
            let tmp = JSON.parse(localStorage.nmlp);
            if (tmp[this.book] && this._get["new"] != 1) {
                this.client.move(tmp[this.book]);
            } else {
                this.client.autosave();
                this.main();
            }
        })
    }

    /**
     * main
     */
    main() {
        let $shot = $(this.sceneData[this.cursor]);
        let waiting = true;
        switch($shot.prop("tagName")) {
            case "background":
                this.setBackground($shot);
                break;
            case "image":
                this.setImage($shot);
                break;
            case "html":
                this.setHtml($shot);
                break;
            case "caption":
                this.setCaption($shot);
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
            case "script":
                this.runScript($shot);
                break;
            default :
                waiting = false;
                this.cursor++;
        }

        if (!waiting) {
            setTimeout(() => {
                this.main()
            }, 100);
        }
    }

    /**
     * Set the Background.
     * @param {Node} $obj
     * @returns {boolean}
     */
    setBackground($obj) {
        let fileName = $obj.attr("file");
        if (fileName) {
            fileName = "nmlp-lib/resources/" + this.book + "/" + fileName;
            let img = new Image();
            img.src = fileName;
            img.onload = () => {
                $("#background").css({
                    backgroundImage: "url(" + fileName + ")"
                });
                this.cursor++;
                this.main();
            };
            return true;
        } else {
            return false;
        }
    }

    /**
     * Set the Image.
     * @param {Node} $obj
     * @returns {boolean}
     */
    setImage($obj) {
        let x;
        let fileName = $obj.attr("file");
        if (fileName) {
            fileName = "nmlp-lib/resources/" + this.book + "/" + fileName;
            let _img = new Image();
            _img.src = fileName;
            _img.onload = () => {
                let $img = $("<img src=\"" + fileName + "\">");
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
                    transform: "translate(-50%, -50%) translate(" + x + ", 0)",
                });
                $("#foreground").append($img);
                this.cursor++;
                this.main();
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Set the Html.
     * @param {Node} $obj
     */
    setHtml($obj) {
        let fileName = $obj.attr("file");
        if (fileName) {
            if (!fileName.match(/^https?:\/\//)) {
                fileName = "nmlp-lib/resources/" + this.book + "/" + fileName;
            }
            let $iframe = $("<iframe></iframe>");
            let width = $obj.attr("width") ? $obj.attr("width") : "100%";
            let height = $obj.attr("height") ? $obj.attr("height") : "100%";
            let x = $obj.attr("x") ? (parseFloat($obj.attr("x")) / 2) + "vw" : "0vw";
            let y = $obj.attr("y") ? (parseFloat($obj.attr("y")) / 2) + "vh" : "0vh";
            $iframe.css({
                display: "none",
                width: width,
                height: height,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) translate(" + x + ", " + y + ")",
            });
            $iframe.attr("src", fileName);
            $iframe.on("load", () => {
                $iframe.css("display", "block");
                this.cursor++;
                this.main();
            });
            $("#foreground").append($iframe);
        }
    }

    /**
     * Set the Caption.
     * @param {Node} $obj
     */
    setCaption($obj) {
        $("#cap_next").css("display", "none");
        $("#caption").css("display", "block");
        $("#cap_name").html($obj.attr("name"));
        let counter = 1;
        let stepShow = setInterval(() => {
            $("#cap_body").html($obj.text().slice(0, counter + 1));
            if (counter >= $obj.text().length) {
                clearInterval(stepShow);
                $("#cap_next").css("display", "block");
                this.cursor++;
            }
            counter++;
        }, 25);
    }

    /**
     * Set the Selection.
     * @param {Node} $obj
     */
    setSelect($obj) {
        $("#selection").children().remove();
        $obj.children("option").each(function() {
            let $selection = $("<div class=\"option\">" + this.childNodes[0].nodeValue.trim() + "</div>");
            let $script = $(this).children("script");
            $selection.on("click", function(){
                $("#selection").css("display", "none");
                let nml = nmlp.client;
                //debug("script", $script.text());
                eval($script.text());
            });

            $("#selection").append($selection);
        });

        $("#cap_next").css("display", "none");
        $("#selection").css("display", "block");
    }

    /**
     * Run the Script.
     * @param {Node} $obj
     */
    runScript($obj) {
        let nml = nmlp.client;
        eval($obj.text());
    }

    /**
     * Clear (Foreground) Screen.
     */
    clearScreen() {
        $("#foreground").children().remove();
    }

    /**
     * Fade the layer.
     * @param $obj
     */
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

/**
 * @class Client
 * @property {object}
 */
class Client {
    args = {};

    /**
     * Get the Variable.
     * @param n
     * @returns {*}
     */
    getVar(n) {
        return this.args[n];
    }

    /**
     * Set the Variable.
     * @param n
     * @param v
     */
    setVar(n, v) {
        this.args[n] = v;
    }

    /**
     * Move to Id.
     * @param {string} id
     * @returns {boolean}
     */
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
            nmlp.scene = id;
            nmlp.xml = data;
            nmlp.sceneData = xpath(data, "/scene/*");
            nmlp.cursor = 0;
            this.autosave();
            nmlp.main();
        })
    }

    /**
     * Save by Automatic.
     */
    autosave() {
        let tmp = JSON.parse(localStorage.nmlp);
        tmp[nmlp.book] = nmlp.scene;
        localStorage.nmlp = JSON.stringify(tmp);
    }
}

/**
 * Output the Debug string
 * @param obj1
 * @param obj2
 */
const debug = function(obj1, obj2) {
    if (DEBUG) {
        console.log(obj1);
        console.log(obj2);
    }
};

/**
 * Evaluate by xpath
 * @param {xml} xml
 * @param {string} xpath
 * @returns {Node[]}
 */
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

