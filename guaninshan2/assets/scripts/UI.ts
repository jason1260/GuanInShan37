const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;

    @property(cc.Node)
    hpBarColor: cc.Node = null;

    @property(cc.Label)
    bulletLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    private playerTs = null;

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.playerTs = cc.find('Canvas/Main Camera/player').getComponent('player');
        this.bulletLabel.string = this.playerTs.bulletNum;
        this.hpBar.progress = this.playerTs.HP / 100;
        this.hpBarColor.color = cc.color((1-Math.pow(this.hpBar.progress, 6))*255, this.hpBar.progress*255, 0);
        this.scoreLabel.string = this.playerTs.score;
    }

    start () {

    }

    update (dt) {

    }

    onKeyDown (event) {
        if (event.keyCode === cc.macro.KEY.o && this.playerTs.HP > 0) {
            this.playerTs.HP -= 1;
            this.hpUpdate();
        } else if (event.keyCode === cc.macro.KEY.p && this.playerTs.HP < 100) {
            this.playerTs.HP += 1;
            this.hpUpdate();
        }
    }

    onKeyUp () {

    }

    hpUpdate () {
        this.hpBar.progress = this.playerTs.HP / 100;
        this.hpBarColor.color = cc.color((1-Math.pow(this.hpBar.progress, 6))*255, this.hpBar.progress*255, 0);
    }

    bulletUpdate () {
        this.bulletLabel.string = this.playerTs.bulletNum;
    }

    scoreUpdate () {
        this.scoreLabel.string = this.playerTs.score;
    }
}
