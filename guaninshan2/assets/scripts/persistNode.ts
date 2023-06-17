// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class persist extends cc.Component {

    playerRole = null;

    selectTs = null;

    selectStage = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.selectTs = cc.find("Canvas").getComponent("Selectstage");
        cc.game.addPersistRootNode(this.node);
        
    }

    start() {

    }

    update(dt) {

    }
}
