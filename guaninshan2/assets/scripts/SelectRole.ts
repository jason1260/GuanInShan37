// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectRole extends cc.Component {

    @property(cc.Button)
    selling: cc.Button;

    @property(cc.Button)
    tangmen: cc.Button;

    @property(cc.Button)
    errmei: cc.Button;

    @property(cc.Node)
    selling_intro: cc.Node;

    @property(cc.Node)
    tangmen_intro: cc.Node;

    @property(cc.Node)
    errmei_intro: cc.Node;

    @property(cc.Button)
    startBtn: cc.Button;

    public currentRole: string;
    public snode: cc.Node;
    public tnode: cc.Node;
    public enode: cc.Node;


    onLoad() {
        this.selling.node.on(cc.Node.EventType.TOUCH_END, this.changeSelling, this);
        this.tangmen.node.on(cc.Node.EventType.TOUCH_END, this.changeTangmen, this);
        this.errmei.node.on(cc.Node.EventType.TOUCH_END, this.changeErrmei, this);
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.startgame, this);
        this.currentRole = "selling";
        this.snode = cc.find("Canvas/selling");
        this.tnode = cc.find("Canvas/tanmen");
        this.enode = cc.find("Canvas/errmei");
    }

    startgame() {
        cc.director.loadScene('test');
    }

    changeSelling() {
        if (this.currentRole == "selling") return;
        if (this.currentRole == "tanmen") {
            cc.tween(this.tnode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.tangmen_intro)
                .to(0.5, { position: cc.v3(801, -14, 0) })
                .start();
        } else if (this.currentRole == "errmei") {
            cc.tween(this.enode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.errmei_intro)
                .to(0.5, { position: cc.v3(165, 645, 0) })
                .start();
        }
        cc.tween(this.snode)
            .to(0.5, { scale: 3 })
            .start();
        cc.tween(this.selling_intro)
            .to(0.5, { position: cc.v3(163, -3, 0) })
            .start();

        this.currentRole = "selling";
    }

    changeTangmen() {
        if (this.currentRole == "tanmen") return;
        if (this.currentRole == "selling") {
            cc.tween(this.snode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.selling_intro)
                .to(0.5, { position: cc.v3(795, -3, 0) })
                .start();
        } else if (this.currentRole == "errmei") {
            cc.tween(this.enode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.errmei_intro)
                .to(0.5, { position: cc.v3(165, 645, 0) })
                .start();
        }
        cc.tween(this.tnode)
            .to(0.5, { scale: 3 })
            .start();
        cc.tween(this.tangmen_intro)
            .to(0.5, { position: cc.v3(173, -14, 0) })
            .start();

        this.currentRole = "tanmen";
    }

    changeErrmei() {
        if (this.currentRole == "errmei") return;
        if (this.currentRole == "selling") {
            cc.tween(this.snode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.selling_intro)
                .to(0.5, { position: cc.v3(795, -3, 0) })
                .start();
        } else if (this.currentRole == "tanmen") {
            cc.tween(this.tnode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.tangmen_intro)
                .to(0.5, { position: cc.v3(801, -14, 0) })
                .start();
        }
        cc.tween(this.enode)
            .to(0.5, { scale: 3 })
            .start();
        cc.tween(this.errmei_intro)
            .to(0.5, { position: cc.v3(165, -1, 0) })
            .start();
        this.currentRole = "errmei";
    }

    start() {

    }

    // update (dt) {}
}
