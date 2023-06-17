// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Selectstage extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    stage1: cc.Button = null;
    @property(cc.Button)
    stage2: cc.Button = null;
    @property(cc.Button)
    stage3: cc.Button = null; 

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.stage1.node.on('click', this.Tostage1, this);
        this.stage2.node.on('click', this.Tostage2, this);
        this.stage3.node.on('click', this.Tostage3, this);
    }

    start () {

    }

    Tostage1(){
        cc.director.loadScene("test");
    }
    Tostage2(){
        // cc.director.loadScene("stage2");
    }
    Tostage3(){
        // cc.director.loadScene("stage3");
    }

    // update (dt) {}
}
