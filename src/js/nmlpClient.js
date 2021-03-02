/**
 * @class Client
 * @property {object}
 */
export class Client {
    constructor(nmlp) {
        this.nmlp = nmlp;
        this.args = {};
    }
    getVar(n) {
        return this.args[n];
    }
    setVar(n, v) {
        this.args[n] = v;
    }
    move(id) {
        for(let i in this.nmlp.sceneData) {
            if ($(this.nmlp.sceneData[i]).attr("id") == id) {
                this.nmlp.cursor = i;
                this.nmlp.main();
                return true;
            }
        }
        $.ajax({
            type: "POST",
            url: "api.php",
            dataType: "xml",
            data:{
                book: this.nmlp.book,
                scene: id,
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }).done((data) => {
            //debug("readScene", data);
            this.nmlp.scene = id;
            this.nmlp.xml = data;
            this.nmlp.sceneData = xpath(data, "/scene/*");
            this.nmlp.cursor = 0;
            this.autosave();
            this.nmlp.main();
        })
    }

    autosave() {
        let tmp = JSON.parse(localStorage.nmlp);
        tmp[this.nmlp.book] = this.nmlp.scene;
        localStorage.nmlp = JSON.stringify(tmp);
    }
}
