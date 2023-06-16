// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    public attackNum: number = 0;
    public floor: number = 1;
    public ts = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }
    onCollisionEnter(other, self) {
        if (other.node.group === 'secWall' && this.floor === 2) return;
        if(other.node.group == 'player'){
            this.ts = other.node.getComponent('player') || other.node.getComponent('AIplayer')
            /* console.log(this.attackNum) */
            this.ts.hurt(this.attackNum)
        }
        this.node.destroy()
    }
    setProperty(attackNum: number,floor: number){
        this.attackNum = attackNum;
        this.floor = floor;
    }
    // update (dt) {}
}
