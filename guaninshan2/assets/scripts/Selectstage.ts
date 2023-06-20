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
    @property(cc.Node)
    boss: cc.Node = null;
    @property(cc.Node)
    chain: cc.Node = null;
    @property(cc.AudioClip)
    backgroundmusic: cc.AudioClip = null;
    @property(cc.Button)
    logoutBtn: cc.Button = null;
    @property(cc.Node)
    logoutlabel: cc.Node = null;

    animation: cc.Animation = null;

    player_score = 0;

    volume = 0.5;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.stage1.node.on('click', this.Tostage1, this);
        this.stage2.node.on('click', this.Tostage2, this);
        this.stage3.node.on('click', this.Tostage3, this);
        this.logoutBtn.node.on('click', this.logout, this);
        this.stage1.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.stage1hover(this.stage1_out, 0) }, this)
        this.stage2.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.stage1hover(this.stage2_out, 0) }, this)
        this.stage3.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.stage1hover(this.stage3_out, 0) }, this)
        this.stage1.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.stage1hover(this.stage1_out, 1) }, this)
        this.stage2.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.stage1hover(this.stage2_out, 1) }, this)
        this.stage3.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.stage1hover(this.stage3_out, 1) }, this)
        this.logoutBtn.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.btnhover(this.logoutlabel, 0) }, this)
        this.logoutBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.btnhover(this.logoutlabel, 1) }, this)
        this.setting.node.on("click", this.settingClick, this);
        // this.volume = cc.find("persistnode").getComponent("persistNode").volume;
        this.chain.active = false;
        this.player_score = cc.find("persistnode").getComponent("persistNode").score;

        // cc.find("Canvas/setting/board/volume").getComponent(cc.Slider).progress = cc.find("persistnode").getComponent("persistNode").volume;
        cc.find("Canvas/setting/board/volume").on("slide", this.volumeChange, this);
        cc.find("Canvas/setting/board").active = false;
        cc.find("persistnode").getComponent("persistNode").OneScore = 0;

        cc.find("Canvas/setting/board/volume").getComponent(cc.Slider).progress = cc.find("persistnode").getComponent("persistNode").volume;

        cc.audioEngine.stopMusic();
        cc.find("Canvas/setting/board/volume_num").getComponent(cc.Label).string = (cc.find("persistnode").getComponent("persistNode").volume * 100).toFixed(0);
        cc.audioEngine.setMusicVolume(cc.find("persistnode").getComponent("persistNode").volume);
        cc.audioEngine.playMusic(this.backgroundmusic, true);
    }

    btnhover(target: cc.Node, type: number) {
        if (type == 0) target.color = cc.Color.GRAY;
        else target.color = cc.Color.WHITE;
    }

    logout() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log("sign out");
            cc.find('persistnode').getComponent('persistNode').score = 0;
            cc.find('persistnode').getComponent('persistNode').volume = 0.5;
            cc.director.loadScene("menu");
        }).catch(function (error) {
            // An error happened.
            console.log("sign out error");
        })
    }

    stage1hover(target: cc.Node, type: number) {
        if (this.player_score < 100 && target === this.stage3_out) return;
        if (type == 0) target.scale = 1.1;
        else target.scale = 1;
    }

    volumeChange() {
        cc.find("persistnode").getComponent("persistNode").volume = cc.find("Canvas/setting/board/volume").getComponent(cc.Slider).progress;
        console.log(cc.find("persistnode").getComponent("persistNode").volume);
        cc.find("Canvas/setting/board/volume_num").getComponent(cc.Label).string = (cc.find("persistnode").getComponent("persistNode").volume * 100).toFixed(0);
        // cc.audioEngine.setVolume(cc.find("persistnode").getComponent("persistNode").volume);
        cc.audioEngine.setMusicVolume(cc.find("persistnode").getComponent("persistNode").volume);
    }

    start() {
        console.log("check player score", this.player_score);
        if (this.player_score < 100) {
            this.boss.active = false;
            this.stage3_out.color = cc.color(98, 70, 70);
            this.chain.active = true;
        }
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
        if (this.player_score < 100) return;
        cc.director.loadScene("Select");
        cc.find("persistnode").getComponent("persistNode").selectStage = 3;
    }

    // update (dt) {}
}
