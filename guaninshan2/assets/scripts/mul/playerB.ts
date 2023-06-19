// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
declare const firebase: any;
import Player from "../player";
import gameInfo = require("../gameInfo");
const {ccclass, property} = cc._decorator;
const Input = {}
@ccclass
export default class playerB extends Player {

    public roomListener  = null;
    public roomData = null;
    public room = null;
    public mulRole = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.room = cc.find("persistnode").getComponent("persistNode").room;
        this.mulRole = cc.find("persistnode").getComponent("persistNode").mulRole


        this.roomListener  = firebase.database().ref('rooms/' + this.room).on('value', (snapshot) => {
            const roomData = snapshot.val();           
        });
        // console.log("player onLoad")
        this.leftHand = this.node.getChildByName("leftHand");
        cc.resources.load(`role/${this.role}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error("加载图像资源失败：", err);
                return;
            }
            // console.log(spriteFrame)
            // 获取 Sprite 组件
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

        });
        this.HP = gameInfo.roleHP[this.role]
        this.baseSpeed = gameInfo.roleSpeed[this.role]



        for (var member in Input)  Input[member] = 0;
        this.score = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.GM = cc.find("Canvas/GM").getComponent('GM');

        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
        this.onMud = false;
    }

    start () {

    }
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        firebase.database().ref('rooms/' + this.room).off('value', this.roomListener);
    }
    // update (dt) {}
    setRole(role: string) {
        this.role = role;
        cc.resources.load(`role/${this.role}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error("加载图像资源失败：", err);
                return;
            }
            // console.log(spriteFrame)
            // 获取 Sprite 组件
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

        });
        this.HP = gameInfo.roleHP[this.role]
        this.baseSpeed = gameInfo.roleSpeed[this.role]
    }
    onKeyDown(e) {

        Input[e.keyCode] = 1;
        firebase.database().ref('rooms/' + this.room+`/${this.mulRole}`).update({Input:Input});
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
        firebase.database().ref('rooms/' + this.room+`/${this.mulRole}`).update({Input:Input});
    }
}
