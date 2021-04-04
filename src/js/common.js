import {Userconf} from "./userconf.js";
import {Nmlp} from "./nmlp.js";

let userconf = new Userconf();
let nmlp = new Nmlp();

// キー検出
$("html").on("keyup", function(e){
    if (!configWait.match(/^k/)) {
        switch (e.key) {
            case userconf.commandMap["kOk"]:
                controlEnter();
                break;
            case userconf.commandMap["kUp"]:
                controlArrow(-1);
                break;
            case userconf.commandMap["kDn"]:
                controlArrow(1);
                break;
            default:
                return true;
        }
        return false;
    } else {
        userconf.actionWait(e);
    }
});

// 設定パネル用出し入れ用
$("#configSensor").on("click", () => {
     if ($("#configPanel").css("top") == "0px") {
         $("#configPanel").animate({top: "-100px"});
     } else {
         $("#configPanel").animate({top: "0px"});
     }
});

// Enterキーを押された
const controlEnter = () => {
    if ($("#cap_next").css("display") == "block") {
        $("#cap_next").click();
    } else if ($("#selection").css("display") == "block") {
        $("#selection .active").click();
    }
};

// ↓もしくは↑キーを押された
const controlArrow = (n) => {
    let $target;
    if ($("#selection").css("display") == "none") {
        return false;
    }
    if (n == 1) {
        $target = $("#selection .active").next();
        if (!$target.length) {
            console.log("error");
            $target = $("#selection .option:first");
        }
    } else if (n == -1) {
        $target = $("#selection .active").prev();
        if (!$target.length) {
            console.log("error");
            $target = $("#selection .option:last");
        }
    }
    $("#selection .option").removeClass("active");
    $target.addClass("active");
    //console.log($("#selection .active").next());
};

// 設定画面を閉じるボタン
$("#closeConfigButton").on("click", () => {
    $("#configBody").css("display", "none");
    $("#cap_next").css("display", "block");
});

// 設定画面を開くボタン
$("#openConfigButton").on("click", () => {
    $("#configBody").css("display", "block");
    $("#cap_next").css("display", "none");
    for (let i in userconf.commandMap) {
        userconf.setIcon($("[data-button=" + i + "]"), userconf.commandMap[i]);
    }
});

// GamaPad 関連設定
let gamePads = {};
let gpInterval;

const scanGp = () => {
    let count = 0;
    let next = 50;
    //let gps = navigator.getGamepads();
    if (!configWait.match(/^p/)) {
        for (let i in gamePads) {
            if (navigator.getGamepads()[i].buttons[
                userconf.commandMap["pOk"]
                ].value) {　// B0
                next = 500;
                controlEnter();
            } else if (navigator.getGamepads()[i].buttons[
                userconf.commandMap["pUp"]
                ].value) { // ↑
                next = 100;
                controlArrow(-1);
            } else if (navigator.getGamepads()[i].buttons[
                userconf.commandMap["pDn"]
                ].value) { // ↓
                next = 100;
                controlArrow(1);
            }
            count++;
        }
        if (count) {
            setTimeout(scanGp, next);
        }
    } else {
        for (let i in gamePads) {
            for (let j in navigator.getGamepads()[i].buttons) {
                if (navigator.getGamepads()[i].buttons[j].value) {
                    userconf.actionWaitPad(j);
                }
            }
        }
        setTimeout(scanGp, 100);
    }
};

const gh = (e, f) => {
    console.log(e.gamepad.index);
    if (f) {
        gamePads[e.gamepad.index] = e.gamepad;
    } else {
        delete gamePads[e.gamepad.index];
    }
};

window.addEventListener("gamepadconnected", function(e){
    console.log("connected");
    gh(e,true);
    gpInterval = setTimeout(scanGp, 50);
}, false);

window.addEventListener("gamepaddisconnected", function(e){
    console.log("disconnected");
    gh(e, false);
}, false);

$("#caption").on("click", function(e){
    //$("#caption").css("display", "none");
    if ($("#cap_next").css("display") ==  "block") {
        nmlp.main();
    }
});

