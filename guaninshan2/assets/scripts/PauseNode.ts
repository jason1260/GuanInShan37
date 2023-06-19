// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { notstart } from "./boss/GM_boss";

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Node)
    PauseMenu: cc.Node;

    @property(cc.Button)
    continue: cc.Button;

    onLoad() {
        this.PauseMenu.active = false;
        this.continue.node.on('click', this.ContinueClick, this);
        cc.systemEvent.on('keydown', this.onKeyDown, this);
        cc.systemEvent.off('keyup', this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode == cc.macro.KEY.p) {
            if (notstart) this.PauseMenu.scale = 0.3;
            console.log("p pressed");
            this.PauseMenu.active = true;
            cc.game.canvas.style.cursor = 'default';
            cc.director.pause();
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (event.keyCode == cc.macro.KEY.p) {
            console.log("escape clicked");
            this.PauseMenu.active = true;
            cc.director.pause();
        }
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    ContinueClick() {
        this.PauseMenu.active = false;
        cc.game.canvas.style.cursor = 'none';
        cc.director.resume();
    }


}
