const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraTransposer extends cc.Component {


    
    target: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    onload(){
        
    }
    update(dt) {
        if(!this.target){
            this.target = cc.find("Canvas/Main Camera/player")
            if(!this.target) return
        }
        // using convertToWorldSpaceAR + convertToNodeSpaceAR because
        // they are inaccurate and causes camera jitter. :(

        if (!this.target) return;
        let targetPos = this.target.convertToWorldSpaceAR(cc.v2(0, 0));
        let newPos = this.node.parent.convertToNodeSpaceAR(targetPos);
        console.log(newPos)
        //console.log(newPos.y)
        if (newPos.x < 958 && newPos.x > 0) {
            this.node.x = newPos.x;
        }else{
            if(newPos.x >= 958) this.node.x = 958;
            else this.node.x = 0;
        }
        if (newPos.y < 556 && newPos.y > 0) {
            this.node.y = newPos.y;
        }else{
            if(newPos.y >= 556) this.node.y = 556;
            else this.node.y = 0;
        }
        //this.node.y = newPos.y;
    }
}

