import hands from "./hands";

const {ccclass, property} = cc._decorator;

export var AIknife_valid;

@ccclass
export default class AIhands extends hands {

    // LIFE-CYCLE CALLBACKS:
    public AIplayerTs = null;

    public attacking: boolean = false;

    public target = null;

    public knifeAttackRadius = 70;

    onLoad () {
        this.AIplayerTs = this.node.getComponent('AIPlayer');
        AIknife_valid = false;
    }

    start () {
    }

    update (dt) {
        if (this.AIplayerTs.Handstate == 'changing')
            this.changingAni()
        if (this.AIplayerTs.Handstate != 'changing' && !this.attacking)
            this.idleAni()
        
        this.mousePt = this.AIplayerTs.attackingTarget.getPosition();
        this.HandPos();
        this.attack();
    }

    idleAni() {
        switch (this.AIplayerTs.Handstate) {
            case 'gun':
                this.leftAngle = 5
                this.rightAngle = -this.leftAngle;
                break;
            case 'knife':
                this.leftAngle = 45
                this.rightAngle = -this.leftAngle;
                break;
            default:
                break;
        }
    }

    attack() {
        if (this.AIplayerTs.Handstate === 'changing' || this.attacking) return;
        this.attacking = true;

        switch (this.AIplayerTs.Handstate) {
          case 'gun':
            this.shoot();
            this.scheduleOnce(() => {
              this.attacking = false;
            }, 0.2);
            break;
      
          case 'knife':
            if (this.AIplayerTs.enemyDistance < this.knifeAttackRadius){
                this.leftAngle = 0;
                AIknife_valid = true;
        
                // 逐渐改变角度的函数
                const rotateAngle = (targetAngle: number, duration: number) => {
                const startAngle = this.leftAngle;
                let elapsedTime = 0;
                const interval = 0.02; // 每帧间隔时间，可根据需要调整
        
                const update = () => {
                    elapsedTime += interval;
                    const t = Math.min(elapsedTime / duration, 1); // 插值参数
        
                    // 根据插值参数 t 计算当前角度
                    this.leftAngle = cc.misc.lerp(startAngle, targetAngle, t);
        
                    if (t >= 1) {
                    // 动画结束后的操作
                    this.leftAngle = 45;
                    this.attacking = false;
                    AIknife_valid = false;
                    } else {
                    // 继续更新角度
                    setTimeout(update, interval * 1000);
                    }
                };
        
                update();
                };
        
                rotateAngle(45, 0.2); // 调用函数开始逐渐改变角度
            }
            else 
                this.attacking = false;
            break;
      
          default:
            break;
        }
      }
      //在这个示例中，我添加了一个名为 rotateAngle 的函数，该函数用于逐渐改变角度。它接受目标角度和持续时间作为参数，并使用递归调用来实现逐帧更新角度直到达到目标角度为止。可以根据需要调整每帧的间隔时间 interval，以控制动画的流畅度。
      shoot() {
        // cc.log("AIshoot!!!!!!!!!!!!!!!!!!!!!");

        //這裡的radius和cursor的差兩倍
        const dest = this.getRandomInCircle_polar_better(this.AIplayerTs.shootRadius);

        // 创建射线的起始点和终点

        const startPos = this.node.getPosition();
        // cc.log(startPos);
        const direction = dest.sub(startPos).normalize();
        const endPos = startPos.add(direction.mul(2000));

        // 创建射线的绘制节点
        const bullet = cc.instantiate(this.bulletPrefab);
        /* const parentNode = this.node.parent; */
        const nodeIndex = this.node.children.indexOf(this.leftHand);

        if (nodeIndex -1 <= 0)
            this.node.insertChild(bullet, 0);
        else 
            this.node.insertChild(bullet, nodeIndex - 1);

        bullet.setPosition(new cc.Vec2(this.leftHand.position.x, this.leftHand.position.y));
        bullet.getComponent(cc.Collider).enabled = false;
        bullet.getComponent(cc.RigidBody).linearVelocity = direction.mul(this.bulletVelocity);
    }
}
