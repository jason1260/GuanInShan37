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
    public currentParticle: cc.ParticleSystem;
    public snode: cc.Node;
    public tnode: cc.Node;
    public enode: cc.Node;
    public sparticle: cc.ParticleSystem;
    public tparticle: cc.ParticleSystem;
    public eparticle: cc.ParticleSystem;
    public emissionRate: number = 200;

    onLoad() {
        this.selling.node.on(cc.Node.EventType.TOUCH_END, this.changeSelling, this);
        this.tangmen.node.on(cc.Node.EventType.TOUCH_END, this.changeTangmen, this);
        this.errmei.node.on(cc.Node.EventType.TOUCH_END, this.changeErrmei, this);
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.startgame, this);
        this.currentRole = "selling";
        this.snode = cc.find("Canvas/selling");
        this.tnode = cc.find("Canvas/tanmen");
        this.enode = cc.find("Canvas/errmei");
        this.sparticle = cc.find("Canvas/slParticle").getComponent(cc.ParticleSystem);
        this.tparticle = cc.find("Canvas/tmParticle").getComponent(cc.ParticleSystem);
        this.eparticle = cc.find("Canvas/emParticle").getComponent(cc.ParticleSystem);
        this.currentParticle = this.sparticle;
        this.eparticle.emissionRate = 0;
        this.tparticle.emissionRate = 0;
        console.log(this.currentRole);
    }

    startgame() {
        cc.find("persistnode").getComponent("persistNode").playerRole = this.currentRole;
        console.log("Stage:",cc.find("persistnode").getComponent("persistNode").selectStage);
        if(cc.find("persistnode").getComponent("persistNode").selectStage == 1){
            cc.director.loadScene('test');
        }
        else if(cc.find("persistnode").getComponent("persistNode").selectStage == 2){
            cc.director.loadScene('IceAndFire');
        }else if(cc.find("persistnode").getComponent("persistNode").selectStage == 3){
            cc.director.loadScene('boss');
        }
        // cc.director.loadScene('test');
    }

    changeSelling() {
        if (this.currentRole == "selling") return;
        if (this.currentRole == "tanmen") {
            cc.tween(this.tnode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.tangmen_intro)
                .to(0.5, { position: cc.v3(173, -666, 0) ,opacity:0})
                .start();
            cc.tween(cc.find("Canvas/tangmen/intro"))
                .to(0.5, { opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/tangmen/name"))
                .to(0.5, { opacity:0 })
                .start();
        } else if (this.currentRole == "errmei") {
            cc.tween(this.enode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.errmei_intro)
                .to(0.5, { position: cc.v3(800, 2, 0) ,opacity:0})
                .start();
            cc.tween(cc.find("Canvas/errrr/intro"))
                .to(0.5, { opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/errrr/name"))
                .to(0.5, { opacity:0 })
                .start();
        }
        cc.tween(this.snode)
            .to(0.5, { scale: 3 })
            .start();
        cc.tween(this.selling_intro)
            .to(0.5, { position: cc.v3(163, -3, 0),opacity:255 })
            .start();
        cc.tween(cc.find("Canvas/shaolin/name"))
            .delay(0.5)
            .to(0.5, { opacity:255 })
            .start();
        cc.tween(cc.find("Canvas/shaolin/intro"))
            .delay(1)
            .to(0.5, { opacity:255 })
            .start();
        
        this.currentParticle.emissionRate = 0;
        this.sparticle.emissionRate = this.emissionRate;
        this.currentParticle = this.sparticle;
        cc.log(this.currentParticle);
        this.currentRole = "selling";
    }

    changeTangmen() {
        if (this.currentRole == "tangmen") return;
        if (this.currentRole == "selling") {
            cc.tween(this.snode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.selling_intro)
                .to(0.5, { position: cc.v3(163, 600, 0) ,opacity:0})
                .start();
            cc.tween(cc.find("Canvas/shaolin/intro"))
                .to(0.5, { opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/shaolin/name"))
                .to(0.5, { opacity:0 })
                .start();

        } else if (this.currentRole == "errmei") {
            cc.tween(this.enode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.errmei_intro)
                .to(0.5, { position: cc.v3(800, 2, 0),opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/errrr/intro"))
                .to(0.5, { opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/errrr/name"))
                .to(0.5, { opacity:0 })
                .start();
        }
        cc.tween(this.tnode)
            .to(0.5, { scale: 3 })
            .start();
        cc.tween(this.tangmen_intro)
            .to(0.5, { position: cc.v3(220, 35, 0),opacity:255 })
            .start();
        cc.tween(cc.find("Canvas/tangmen/name"))
            .delay(0.5)
            .to(0.5, { opacity:255 })
            .start();
        cc.tween(cc.find("Canvas/tangmen/intro"))
            .delay(1)
            .to(0.5, { opacity:255 })
            .start();

        this.currentParticle.emissionRate = 0;
        this.tparticle.emissionRate = this.emissionRate;
        this.currentParticle = this.tparticle;
        cc.log(this.currentParticle);
        this.currentRole = "tanmen";
    }

    changeErrmei() {
        if (this.currentRole == "errmei") return;
        if (this.currentRole == "selling") {
            cc.tween(this.snode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.selling_intro)
                .to(0.5, { position: cc.v3(163, 600, 0) ,opacity:0})
                .start();
            cc.tween(cc.find("Canvas/shaolin/intro"))
                .to(0.5, { opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/shaolin/name"))
                .to(0.5, { opacity:0 })
                .start();

        } else if (this.currentRole == "tanmen") {
            cc.tween(this.tnode)
                .to(0.5, { scale: 2 })
                .start();
            cc.tween(this.tangmen_intro)
                .to(0.5, { position: cc.v3(173, -666, 0) ,opacity:0})
                .start();
            cc.tween(cc.find("Canvas/tangmen/intro"))
                .to(0.5, { opacity:0 })
                .start();
            cc.tween(cc.find("Canvas/tangmen/name"))
                .to(0.5, { opacity:0 })
                .start();
        }
        cc.tween(this.enode)
            .to(0.5, { scale: 3 })
            .start();
        cc.tween(this.errmei_intro)
            .to(0.5, { position: cc.v3(160, -1, 0) ,opacity:255})
            .start();
        cc.tween(cc.find("Canvas/errrr/name"))
            .delay(0.5)
            .to(0.5, { opacity:255 })
            .start();
        cc.tween(cc.find("Canvas/errrr/intro"))
            .delay(1)
            .to(0.5, { opacity:255 })
            .start();
        
        this.currentParticle.emissionRate = 0;
        this.eparticle.emissionRate = this.emissionRate;
        this.currentParticle = this.eparticle;
        cc.log(this.currentParticle);
        this.currentRole = "errmei";
    }

    start() {

    }

    // update (dt) {}
}
