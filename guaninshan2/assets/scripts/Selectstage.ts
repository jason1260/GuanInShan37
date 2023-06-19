// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

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
    @property(cc.Node)
    stage1_out: cc.Node = null;
    @property(cc.Node)
    stage2_out: cc.Node = null;
    @property(cc.Node)
    stage3_out: cc.Node = null;
    @property(cc.Button)
    setting: cc.Button = null;
    @property(cc.Button)
    multi: cc.Button = null;

    volume = 0.5;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.stage1.node.on('click', this.Tostage1, this);
        this.stage2.node.on('click', this.Tostage2, this);
        this.stage3.node.on('click', this.Tostage3, this);
        this.stage1.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.stage1hover(this.stage1_out, 0) }, this)
        this.stage2.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.stage1hover(this.stage2_out, 0) }, this)
        this.stage3.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.stage1hover(this.stage3_out, 0) }, this)
        this.stage1.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.stage1hover(this.stage1_out, 1) }, this)
        this.stage2.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.stage1hover(this.stage2_out, 1) }, this)
        this.stage3.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.stage1hover(this.stage3_out, 1) }, this)
        this.setting.node.on("click", this.settingClick, this);
        this.multi.node.on("click", this.multiClick, this);
        this.volume = cc.find("persistnode").getComponent("persistNode").volume;
        cc.find("persistnode").getComponent("persistNode").score = 0;

        // cc.find("Canvas/setting/board/volume").getComponent(cc.Slider).progress = cc.find("persistnode").getComponent("persistNode").volume;
        cc.find("Canvas/setting/board/volume").on("slide", this.volumeChange, this);
        cc.find("Canvas/setting/board").active = false;
    }

    stage1hover(target: cc.Node, type: number) {
        if (type == 0) target.scale = 1.1;
        else target.scale = 1;
    }

    volumeChange() {
        cc.find("persistnode").getComponent("persistNode").volume = cc.find("Canvas/setting/board/volume").getComponent(cc.Slider).progress;
        console.log(cc.find("persistnode").getComponent("persistNode").volume);
        cc.find("Canvas/setting/board/volume_num").getComponent(cc.Label).string = (cc.find("persistnode").getComponent("persistNode").volume * 100).toFixed(0);
        // cc.audioEngine.setVolume(cc.find("persistnode").getComponent("persistNode").volume);
    }

    start() {

    }
    multiClick() {
        cc.director.loadScene("Select");
        cc.find("persistnode").getComponent("persistNode").selectStage = 5;
    }
    settingClick() {
        cc.find("Canvas/setting/board").active = !cc.find("Canvas/setting/board").active;
    }

    Tostage1() {
        cc.director.loadScene("Select");
        cc.find("persistnode").getComponent("persistNode").selectStage = 1;
    }
    Tostage2() {
        cc.director.loadScene("Select");
        cc.find("persistnode").getComponent("persistNode").selectStage = 2;
    }
    Tostage3() {
        cc.director.loadScene("Select");
        cc.find("persistnode").getComponent("persistNode").selectStage = 3;
    }

    // update (dt) {}
}
