// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hands from "../hands";

const {ccclass, property} = cc._decorator;
export var knife_valid;

@ccclass
export default class handsBoss extends hands {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad () {
        this.GM = cc.find("Canvas/GM").getComponent('GM_boss');
        

        this.leftHand = this.node.getChildByName("leftHand");
        this.rightHand = this.node.getChildByName("rightHand");
        this.cursor = this.node.parent.getChildByName("cursor");

        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this)
        this.playerTs = this.node.getComponent('player');

        knife_valid = false;
    }

    start () {

    }

    update (dt) {
        super.update(dt);
    }
}
