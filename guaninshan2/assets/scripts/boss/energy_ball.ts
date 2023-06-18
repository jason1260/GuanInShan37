// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class energyBall extends cc.Component {

    
    public attackNum: number = 0;
    public floor: number = 1;
    public type: number = 1;
    public speed:number = 50;
    public selfNode:cc.Node = null;
    public targetNode:cc.Node = null;
    public ts = null;

    public prev_lv = null;


    public counter:number = 0;
    public degree:number = 270;
    onLoad () {
        if(this.type == 1){
            /* const rotateAction = cc.repeatForever(
                cc.rotateBy(1, this.speed).easing(cc.easeSineInOut())
              );
              
            // 执行动作
            this.node.runAction(rotateAction); */
            
        }
    }
    update(dt){
        if(this.type == 1){
            this.degree+=this.speed;
            this.degree%=361;
            const angle = cc.misc.degreesToRadians(this.degree);
            // 计算新的节点位置
            const newPosition = cc.v3(
                0 + 60 * Math.cos(angle),
                0 + 60 * Math.sin(angle),
                this.node.position.z
            );
            // 更新节点位置
            this.node.setPosition(newPosition);
            
            
        }else{
            this.counter+=1;
            if(this.counter >= 200 || !this.prev_lv){
                console.log('update')
                this.counter = 0;
                const direction = this.targetNode.getPosition().sub(this.node.getPosition()).normalize();
                this.prev_lv = direction.mul(this.speed);
            }
            this.node.getComponent(cc.RigidBody).linearVelocity = this.prev_lv;
            
        }
        
    }
    
    onCollisionEnter(other, self) {
        if (other.node.group === 'secWall' && this.floor === 2) return;
        if (other.node == this.selfNode){
            return;
        };
        if(other.node.group == 'player'){
            this.ts = other.node.getComponent('player') || other.node.getComponent('AIplayer') || other.node.getComponent('boss')
            
            this.ts.hurt(this.attackNum)
            this.node.destroy()
        }
        if(other.node.group == 'gun'){

            this.node.destroy()
        }
        
    }
    setProperty(attackNum: number,speed: number, selfNode:cc.Node,type: number, targetNode:cc.Node = null){
        this.attackNum = attackNum + Math.floor((0.1 * Math.random() - 0.05) * 2 * attackNum);
        this.speed = speed;
        this.type = type;
        this.selfNode = selfNode;
        this.targetNode = targetNode;
    }
}
