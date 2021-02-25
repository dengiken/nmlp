export class Nmls {
    constructor() {
        this.stack = [];
        this.if = [true];
        this.var = {};
        this.dic = {
            "+": () => {
                this.stack.push(this.pop() + this.pop())
            },
            "-": () => {
                this.stack.push(-this.pop() + this.pop())
            },
            "*": () => {
                this.stack.push(this.pop() * this.pop())
            },
            "/": () => {
                this.stack.push(1 / this.pop() * this.pop())
            },
            ">": () => {
                this.stack.push(this.pop() < this.pop())
            },
            "<": () => {
                this.stack.push(this.pop() > this.pop())
            },
            "=": () => {
                this.stack.push(this.pop() == this.pop())
            },
            "!": () => {
                this.stack.pop().val = this.pop();
            },
            "?": () => {
                this.if.push(this.pop());
            },
            ":": () => {
                this.if.push(!this.if.pop());
            },
            ";": () => {
                this.if.pop();
            },
        }
    }
    run(code) {
        let codeResult = false;
        code = this.zen2han(code);
        code.split(/[\s\u{3000}]/u).forEach(v => {
            if (codeResult) {
                return;
            }
            if (!this.if[this.if.length - 1] && !v.match(/[:;]/)) {
                return;
            }
            if (this.dic[v]) {
                this.dic[v]();
            } else if (v.match(/^\$/)) {
                if (this.var[v]) {
                    this.stack.push(this.var[v]);
                } else {
                    this.var[v] = {val:0};
                    this.stack.push(this.var[v]);
                }
            } else {
                if (!isNaN(v)) {
                    this.stack.push(parseFloat(v));
                } else if (v.match(/^#/)) {
                    codeResult = v.substr(1);
                }
            }
        });
        return codeResult;
    }
    pop() {
        let tmp = this.stack.pop();
        if (typeof(tmp) == "object") {
            return tmp.val;
        } else {
            return tmp;
        }
    }

    zen2han(str) {
        return str.replace(/[！-｝]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }
}
