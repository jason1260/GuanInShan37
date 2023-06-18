const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera_bass extends cc.Component {



    target: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    onload() {

    }
    update(dt) {
        if (!this.target) {
            this.target = cc.find("Canvas/Main Camera/player")
            if (!this.target) return
        }
        // using convertToWorldSpaceAR + convertToNodeSpaceAR because
        // they are inaccurate and causes camera jitter. :(

        if (!this.target) return;
        let targetPos = this.target.convertToWorldSpaceAR(cc.v2(0, 0));
        let newPos = this.node.parent.convertToNodeSpaceAR(targetPos);
        // console.log(newPos)
        //console.log(newPos.y)
        this.node.x = newPos.x;
        this.node.y = newPos.y;
        //this.node.y = newPos.y;
    }
}

