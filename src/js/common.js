let nmlp3;

let activeSelection;

$("html").on("keyup", function(e){
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
});

const controlEnter = () => {
    if ($("#cap_next").css("display") == "block") {
        $("#cap_next").click();
    } else if ($("#selection").css("display") == "block") {
        $("#selection .active").click();
    }
};

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