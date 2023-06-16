const {ccclass, property} = cc._decorator;
import { pathing_Map } from "../scripts/GM";
@ccclass
export default class flySword extends cc.Component {

    attackingTarget: cc.Node = null;

    updateTimer = 0;

    camera: cc.Node = null;
    public direction = null;

    onLoad () {
        this.attackingTarget = cc.find("Canvas/Main Camera/player");
        this.camera = cc.find("Canvas/Main Camera");
    }

    start () {

    }

    update (dt) {
        // 获取当前节点位置和目标位置
        const playerPos = this.node.getPosition();
        const targetPos = this.attackingTarget.getPosition().add(this.camera.getPosition());
    
        // 计算方向向量和距离
        this.direction = targetPos.sub(playerPos);
        this.greedy(this.attackingTarget, false, 0.01, dt);
        this.aiming(this.attackingTarget.getPosition());
    }

    aiming(targetPos){

        // console.log(this.direction)
        if(this.direction.x == 0 &&  this.direction.y == 0 && this.direction.z == 0 ) return;
        let angle = cc.v2(1, 0).signAngle(this.direction);
        let degree = cc.misc.radiansToDegrees(angle);
        // cc.log(degree)
        this.node.angle = degree + 45;
    }

    greedy(Target: cc.Node, canCollide: boolean, updatePeriod: number, dt: number) {
        if (!canCollide) {
            this.updateTimer += dt;
            if (this.updateTimer >= updatePeriod) {
                this.updateTimer = 0;
            
                // 获取当前节点位置和目标位置
                const playerPos = this.node.getPosition();
                const targetPos = Target.getPosition().add(this.camera.getPosition());
            
                // 计算方向向量和距离
                this.direction = targetPos.sub(playerPos);
                // cc.log(this.direction)
                const distance = this.direction.mag();

                /* cc.log(distance) */
            
                if (distance > 0) {
                    // 计算移动速度
                    const speed = 80;
                    const moveDistance = Math.min(speed * dt, distance);
                    const moveDirection = this.direction.normalize();
            
                    // 更新节点位置
                    this.node.setPosition(playerPos.add(moveDirection.mul(moveDistance)));
                }
            }
        }
    }
      
      

}
