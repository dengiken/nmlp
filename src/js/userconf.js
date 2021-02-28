export class Userconf
{
    constructor() {
        this.commandMap = {
            "kUp": "ArrowUp",
            "kDn": "ArrowDown",
            "kOk": "Enter",
            "pUp": "12",
            "pDn": "13",
            "pOk": "0"
        }

        this.keyDic = {
            "ArrowUp": "↑",
            "ArrowDown": "↓",
            "ArrowRight": "→",
            "ArrowLeft": "←",
            " ": "Space"
        };
        this.padDic = {
            "0": "a",
            "1": "b",
            "2": "x",
            "3": "y",
            "4": "[",
            "5": "]",
            "6": "{",
            "7": "}",
            "8": "v",
            "9": "m",
            "10": "<",
            "11": ">",
            "12": "W",
            "13": "X",
            "14": "A",
            "15": "D",
        };
    }
    actionWait(e) {
        console.log(e.key);
        this.commandMap[$("#configBody .active").attr("data-button")] = e.key;
        $("#configBody .active")
            .html(this.keyDic[e.key] ? this.keyDic[e.key] : e.key)
            .removeClass("active");
        configWait = "";
    };

    actionWaitPad(b) {
        console.log(b);
        this.commandMap[$("#configBody .active").attr("data-button")] = b;
        $("#configBody .active")
            .html(this.padDic[b] ? this.padDic[b] : b)
            .removeClass("active");
        configWait = "";
    }

    setIcon($target, value) {
        if ($target.attr("data-button").match(/^k/)) {
            $target.html(this.keyDic[value] ? this.keyDic[value]: value);
        } else {
            $target.html(this.padDic[value] ? this.padDic[value]: value);
        }
    }

}

$(".keyConfig").on("click", function () {
    $("#configBody .active").removeClass("active");
    $(this).addClass("active");
    $(this).html("");
    configWait = $(this).attr("data-button");
});
