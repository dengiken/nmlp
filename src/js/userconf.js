export class Userconf
{
    constructor() {
        this.dic = {
            "ArrowUp": "↑",
            "ArrowDown": "↓"
        };
    }
    actionWait(e) {
        console.log(e.key);
        $("#configBody .active").html(this.dic[e.key] ? this.dic[e.key] : e.key);
    };
}

$(".keyConfig").on("click", function () {
    $("#configBody .active").removeClass("active");
    $(this).addClass("active");
    $(this).html("");
    configWait = $(this).attr("data-button");
});
