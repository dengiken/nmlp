import {Userconf} from "./userconf.js";
let activeSelection;

let userconf = new Userconf();

// キー検出
$("html").on("keyup", function(e){
    if (!configWait) {
        switch (e.key) {
            case "Enter":
                controlEnter();
                break;
            case "ArrowUp":
                controlArrow(-1);
                break;
            case "ArrowDown":
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
});

// GamaPad 関連設定
let gamePads = {};
let gpInterval;

const scanGp = () => {
    let count = 0;
    let next = 50;
    let gps = navigator.getGamepads();
    for(let i in gamePads) {
        if (navigator.getGamepads()[i].buttons[0].value) {　// B0
            next = 500;
            controlEnter();
        } else if (navigator.getGamepads()[i].buttons[12].value) { // ↑
            next = 100;
            controlArrow(-1);
        } else if (navigator.getGamepads()[i].buttons[13].value) { // ↓
            next = 100;
            controlArrow(1);
        }
        count++;
    }
    if (count) {
        setTimeout(scanGp, next);
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