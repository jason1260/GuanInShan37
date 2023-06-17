// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    public attackNum: number = 0;
    public floor: number = 1;
    public selfNode:cc.Node = null;
    public ts = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }


    onCollisionEnter(other, self) {
        if (other.node.group === 'secWall' && this.floor === 2) return;
        if (other.node == this.selfNode){
            return;
        };
        if(other.node.group == 'player'){
            this.ts = other.node.getComponent('player') || other.node.getComponent('AIplayer')
            
            this.ts.hurt(this.attackNum)
        }
        this.node.destroy()
    }
    setProperty(attackNum: number,floor: number, selfNode:cc.Node){
        this.attackNum = attackNum;
        this.floor = floor;
        this.selfNode = selfNode;
    }
    // update (dt) {}
}
