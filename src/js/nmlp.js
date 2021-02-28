import {Nmlp3} from "./3d.js";
import {Nmls} from "./nmls.js";

const DEBUG = true;

/**
 * @class Nmlp
 * @property book {string}
 * @property scene {string}
 * @property sceneData {node[]}
 * @property cursor {string}
 * @property xml {xml}
 * @property client {client}
 */
class Nmlp {
    book = "";
    scene = "";
    sceneData = "";
    cursor = 0;
    xml = "";
    client = new Client();
    _get = "";

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
            let tmp = {};
            if (this._get["continue"] && localStorage.nmlp) {
                tmp = JSON.parse(localStorage.nmlp);
            } else {
                localStorage.nmlp = "{}";
            }
            if (tmp[this.book] != "") {
                this.client.move(tmp[this.book]);
            } else {
                this.client.autosave();
                this.main();
            }
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
                break;
            case "image3d":
                this.setImage3d($shot);
                break;
            case "bgm":
                this.setBgm($shot);
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
            case "nmls":
                this.runNmls($shot);
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

    setImage($obj) {
        let x;
        let fileName = $obj.attr("file");
        if (fileName) {
            fileName = "nmlp-lib/resources/" + this.book + "/" + fileName;
            let _img = new Image();
            _img.src = fileName;
            let _anim;
            if ($obj.attr("anim")) {
                _anim = this.parseAnim($obj.attr("anim"));
            }
            _img.onload = () => {
                let $img = $("<img src=\"" + fileName + "\">");
                if (_anim) {
                    switch (_anim.command) {
                        case "slide":
                            this.animSlide($img, _anim.args);
                            //x = (_anim.args[2] / 2) + "vw";
                            break;
                        default:
                    }
                } else {
                    if ($obj.attr("x") != "") {
                        x = (parseFloat($obj.attr("x")) / 2) + "vw";
                    } else {
                        x = "0vw";
                    }
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
                //console.log(x);
            };
            return true;
        } else {
            return false;
        }
    }

    setImage3d($obj) {
        if ($obj.attr("cx")) {
            nmlp3.cameraContainer.position.x = parseFloat($obj.attr("cx"));
            //nmlp3.cameraContainer.position.x = nmlp3.camera.position.x;
            nmlp3.controls.update();
        }
        if ($obj.attr("cy")) {
            nmlp3.cameraContainer.position.y = parseFloat($obj.attr("cy"));
            //nmlp3.cameraContainer.position.y = nmlp3.camera.position.y;
            nmlp3.controls.update();
        }
        if ($obj.attr("cz")) {
            nmlp3.cameraContainer.position.z = parseFloat($obj.attr("cz"));
            //nmlp3.cameraContainer.position.z = nmlp3.camera.position.z;
            nmlp3.controls.update();
        }

        if ($obj.attr("lookAt")) {
            let lookAt = $obj.attr("lookAt").split(",").map(v => parseFloat(v));
            nmlp3.orbitTarget(lookAt[0], lookAt[1], lookAt[2]);
            nmlp3.controls.update();
        }

        let fileName = $obj.attr("file");
        if (fileName) {
            let x = $obj.attr("x") ? parseFloat($obj.attr("x")) : 0;
            let y = $obj.attr("y") ? parseFloat($obj.attr("y")) : 0;
            let z = $obj.attr("z") ? parseFloat($obj.attr("z")) : 0;

            let anim = $obj.attr("anim") ? $obj.attr("anim") : null;

            nmlp3.load(fileName, [x, y, z], anim, this);
        }
    }

    setBgm($obj) {
        let fileName = $obj.attr("file");
        if (fileName) {
            fileName = "nmlp-lib/resources/" + this.book + "/" + fileName;
            let $audio = $("<audio src=\"" + fileName + "\" autoplay>");
            $("#background").append($audio);
        } else if ($obj.attr("play") == "stop"){
            $("#background audio").remove();
        }
        this.cursor++;
        this.main();
    }

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

    setCaption($obj) {
        $("#cap_next").css("display", "none");
        $("#caption").css("display", "block");
        $("#cap_name").html($obj.attr("name") ? $obj.attr("name") : "");
        $("#cap_body").html("");
        $("#cap_body").append(("<span>" + $obj.html() + "</span>").replace(/>([^<]+)/g, (a) => {
            let ret = "";
            for(let i in a) {
                if (a[i] == ">") {
                    ret += ">";
                } else {
                    ret += "<span class=\"cap_char\">" + a[i] + "</span>";
                }
            }
            return ret;
        }));
        let counter = 0;
        let stepShow = setInterval(() => {
            $(".cap_char").eq(counter).css("display", "inline");
            if (counter > $("#cap_body .cap_char").length) {
                clearInterval(stepShow);
                $("#cap_next").css("display", "block");
                this.cursor++;
            }
            counter++;
        }, 25);
    }

    setSelect($obj) {
        $("#selection").children().remove();
        $obj.children("option").each(function() {
            let $selection = $("<div class=\"option\">" + this.childNodes[0].nodeValue.trim() + "</div>");
            let $script = $(this).children("script");
            if ($script) {
                $selection.on("click", function () {
                    $("#selection").css("display", "none");
                    let nml = nmlp.client;
                    //debug("script", $script.text());
                    eval($script.text());
                });
            }
            let $nmls = $(this).children("nmls");
            if ($nmls) {
                $selection.on("click", function () {
                    $("#selection").css("display", "none");
                    let result = nmls.run($nmls.attr("code"));
                    console.log(result);
                    if (result) {
                        nmlp.client.move(result);
                    }
                });
            }

            $("#selection").append($selection);
        });

        activeSelection = 0;
        $("#selection .option").eq(0).addClass("active");
        $("#selection .option").on("mouseover", function(){
            console.log("mouse");
            $("#selection .option").removeClass("active");
            $(this).addClass("active");
        });

        $("#cap_next").css("display", "none");
        $("#selection").css("display", "block");
    }

    runScript($obj) {
        let nml = this.client;
        eval($obj.text());
    }

    runNmls($obj) {
        console.log("nmls");
        let result = nmls.run($obj.attr("code"));
        console.log(result);
        if (result) {
            this.client.move(result);
        }
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

    parseAnim(anim) {
        let matches;
        if(!(matches = anim.match(/^([^\(]+)\((.+)\)$/))) {
            console.log("error");
            return false;
        }
        let args = matches[2].split(",").map(arg => arg.trim());
        let retval = {};
        if (matches[1].trim()) {
            retval= {
                "command": matches[1].trim(),
                "args": args.map(arg => parseInt(arg))
            }
        }
        return retval;
    }

    animSlide($obj, args) {
        let x, y, a, dx, dy, da, counter = 0;
        let split = 10;
        x = args[0] / 2;
        y = args[1] / 2;
        if (!isNaN(args[4]) && !isNaN(args[5])) {
            a = args[4];
            da = (args[5] - a) / split;
        } else {
            a = 100;
            da = 0;
        }
        dx = ((args[2] / 2) - x) / split;
        dy = ((args[3] / 2) - y) / split;
        $obj.css({display: "none"});
        $("#foreground").append($obj);
        let fn = setInterval(() => {
            $obj.css({
                height: "100%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) translate(" + (x) + "vw, " + (y) + "vh)",
                display: "block",
                opacity: a / 100,
            });
            x += dx;
            y += dy;
            a += da;
            counter++;
            if (counter >= split) {
                clearInterval(fn);
                this.cursor++;
                this.main();
            }
        }, 100);
        console.log($obj);
        console.log(args);
    }
}

/**
 * @class Client
 * @property {object}
 */
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
            nmlp.scene = id;
            nmlp.xml = data;
            nmlp.sceneData = xpath(data, "/scene/*");
            nmlp.cursor = 0;
            this.autosave();
            nmlp.main();
        })
    }

    autosave() {
        let tmp = JSON.parse(localStorage.nmlp);
        tmp[nmlp.book] = nmlp.scene;
        localStorage.nmlp = JSON.stringify(tmp);
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

nmlp = new Nmlp();

let nmls = new Nmls();

$("#caption").on("click", function(e){
    //$("#caption").css("display", "none");
    if ($("#cap_next").css("display") ==  "block") {
        nmlp.main();
    }
});

