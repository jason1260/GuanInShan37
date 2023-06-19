const { ccclass, property } = cc._decorator;

@ccclass
export default class UI_mul extends cc.Component {

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;

    @property(cc.Node)
    hpBarColor: cc.Node = null;

    @property(cc.ProgressBar)
    skillBar: cc.ProgressBar = null;

    @property(cc.Node)
    skillBarColor: cc.Node = null;

    @property(cc.Label)
    bulletLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    private playerTs = null;
    private playerHpMax: number = 0;
    mulRole: cc.Node = null;

    onLoad() {
        this.mulRole = cc.find("persistnode").getComponent("persistNode").mulRole
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.playerTs = null;
        console.log("UI destroy")
    }

    update(dt) {
        if (!this.playerTs) {
            this.playerTs = cc.find(`Canvas/Main Camera/player_${this.mulRole}`).getComponent('player');
            if (!this.playerTs) return
            this.bulletLabel.string = this.playerTs.bulletNum;
            this.playerHpMax = this.playerTs.HP;
            this.hpBar.progress = this.playerTs.HP / this.playerHpMax;
            this.skillBar.progress = this.playerTs.CD / 100;
            this.skillBarColor.color = cc.color(255, 255, 255);
            this.hpBarColor.color = cc.color((1 - Math.pow(this.hpBar.progress, 6)) * 255, this.hpBar.progress * 255, 0);
            this.scoreLabel.string = this.playerTs.score;
        }
        this.hpUpdate();
        this.scoreUpdate();
        this.bulletUpdate();
        this.skillUpdate();
    }

    onKeyDown(event) {
        if (event.keyCode === cc.macro.KEY.o && this.playerTs.HP > 0) {
            this.playerTs.HP -= 1;
            this.hpUpdate();
        } else if (event.keyCode === cc.macro.KEY.p && this.playerTs.HP < this.playerHpMax) {
            this.playerTs.HP += 1;
            this.hpUpdate();
        }
    }

    onKeyUp() {

    }

    hpUpdate() {
        this.hpBar.progress = this.playerTs.HP / this.playerHpMax;
        this.hpBarColor.color = cc.color(Math.min((1 - Math.pow(this.hpBar.progress, 6)) * 255, 255), Math.min(this.hpBar.progress * 255, 255), 0);
    }

    bulletUpdate() {
        this.bulletLabel.string = this.playerTs.bulletNum;
    }

    scoreUpdate() {
        this.scoreLabel.string = this.playerTs.score;
    }

    skillUpdate () {
        this.skillBar.progress = this.playerTs.CD / 100;
        this.skillBarColor.color = cc.color(255, 255, 255-this.skillBar.progress*255);
    }
}
