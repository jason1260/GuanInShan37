import gameInfo = require("./gameInfo");
import hands from "./hands";
import { pathing_Map } from "./GM";
import Astar from "./astar";

const { ccclass, property } = cc._decorator;

export var AIknife_valid;

@ccclass
export default class AIhands extends hands {

    // LIFE-CYCLE CALLBACKS:
    public AIplayerTs = null;

    public attacking: boolean = false;

    public target = null;

    public knifeAttackRadius = 80;

    public onFloor: number = 1;

    noObstacle = true;

    Canshoot = false;

    onCollisionStay(other, self) {
        if (other.node.group === 'secFloor') this.onFloor = 2;
    }

    onCollisionExit(other, self) {
        if (other.node.group === 'secFloor') this.onFloor = 1;
    }

    onLoad() {
        this.AIplayerTs = this.node.getComponent('AIPlayer');
        AIknife_valid = false;
    }

    start() {
    }

    update(dt) {
        if (this.AIplayerTs.Handstate == 'changing')
            this.changingAni()
        if (this.AIplayerTs.Handstate != 'changing' && !this.attacking)
            this.idleAni()

        if (this.AIplayerTs.attackingTarget && this.AIplayerTs.attackingTarget.name != ''){
            // cc.log(this.AIplayerTs.attackingTarget)
            this.mousePt = this.AIplayerTs.attackingTarget.getPosition();
        }
        else
            this.mousePt = cc.v2(0, 0)

        this.HandPos();
        this.checkCanShoot();
        this.attack();
    }

    checkCanShoot() {
        if (!this.AIplayerTs.attackingTarget || this.AIplayerTs.attackingTarget.name == '') return;
        let startplace = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        let endplace = this.AIplayerTs.attackingTarget.convertToWorldSpaceAR(new cc.Vec2(0, 0));


        let playerMapPos = [Math.floor(startplace.x / 48), Math.floor(startplace.y / 48)];
        let targetMapPos = [Math.floor(endplace.x / 48), Math.floor(endplace.y / 48)];

        let [startX, startY] = playerMapPos;
        let [endX, endY] = targetMapPos;
        let dx = endX - startX;
        let dy = endY - startY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // cc.log( playerMapPos, targetMapPos)

        // cc.log(startX, startY, endX, endY);
        // cc.log(this.sight, distance)
        let obstacleflag = 0;
        let floorWallflag = 0;
        let nofloorWall = false;
        // cc.log(this.AIplayerTs.sight , distance)
        if (this.AIplayerTs.sight > distance) {
            let path = [];
            for (let i = 1; i < distance; i++) {
                const x = Math.round(startX + (dx * i) / distance);
                const y = Math.round(startY + (dy * i) / distance);
                // cc.log(x, y, this.AIplayerTs.pathing_Map)
                if (pathing_Map[x][24-y] == 1) {
                    obstacleflag = 1;
                }
                else if (pathing_Map[x][24-y] == 3) {
                    floorWallflag = 1;
                }
                path.push([x, y])
            }
            // cc.log(path, playerMapPos, targetMapPos, pathing_Map[4][8])
            this.noObstacle = (obstacleflag) ? false : true;
            nofloorWall = (floorWallflag) ? false : true;
        } 
        
        this.Canshoot = (this.onFloor == 2 && this.noObstacle)|| (this.onFloor == 1 && pathing_Map[endX][24-endY] == 0 && nofloorWall && this.noObstacle);
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
        if (this.AIplayerTs.Handstate === 'changing' || this.attacking || !this.AIplayerTs.attackingTarget || this.AIplayerTs.attackingTarget.name == '') return;
        this.attacking = true;
        /* cc.log(this.noObstacle) */
        switch (this.AIplayerTs.Handstate) {
            case 'rifle':
                if (this.Canshoot) {
                    this.shoot();
                    this.scheduleOnce(() => {
                        this.attacking = false;
                    }, gameInfo.weaponAttackTime[this.AIplayerTs.Handstate]);
                }
                else
                    this.attacking = false;
                break;
            case 'gun':
                // cc.log(this.AIplayerTs.noObstacle);
                if (this.Canshoot) {
                    this.shoot();
                    this.scheduleOnce(() => {
                        this.attacking = false;
                    }, gameInfo.weaponAttackTime[this.AIplayerTs.Handstate]);
                }
                else
                    this.attacking = false;
                break;
            case 'stick':
            case 'knife':
                if (this.AIplayerTs.enemyDistance < this.knifeAttackRadius) {
                    this.leftAngle = 0;
                    this.initBullet2knife()
                    AIknife_valid = true;

                    // 逐渐改变角度的函数
                    const rotateAngle = (targetAngle: number, duration: number) => {
                        const startAngle = this.leftAngle;
                        let elapsedTime = 0;
                        const interval = gameInfo.weaponAttackTime[this.AIplayerTs.Handstate]; // 每帧间隔时间，可根据需要调整

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

        // 创建射线的绘制节点
        const bullet = cc.instantiate(this.bulletPrefab);
        bullet.getComponent('bullet').setProperty(gameInfo.weaponDamage[this.AIplayerTs.Handstate], this.onFloor)
        /* const parentNode = this.node.parent; */
        const nodeIndex = this.node.children.indexOf(this.leftHand);

        if (nodeIndex - 1 <= 0)
            this.node.insertChild(bullet, 0);
        else
            this.node.insertChild(bullet, nodeIndex - 1);

        bullet.setPosition(new cc.Vec2(this.leftHand.position.x, this.leftHand.position.y));
        bullet.getComponent(cc.Collider).enabled = false;
        bullet.getComponent(cc.RigidBody).linearVelocity = direction.mul(gameInfo.bulletVelocity[this.AIplayerTs.Handstate]);
    }

    initBullet2knife() {

        const bullet = cc.instantiate(this.bulletPrefab);
        bullet.opacity = 0;
        bullet.getComponent('bullet').setProperty(gameInfo.weaponDamage[this.AIplayerTs.Handstate], this.onFloor)
        // console.log(bullet.getComponent('bullet').attackNum)

        const knife = this.leftHand.children[0];
        if (!knife) return
        knife.addChild(bullet)
        bullet.setPosition(new cc.Vec2(this.leftHand.position.x, this.leftHand.position.y));
        bullet.getComponent(cc.Collider).enabled = false;
        this.scheduleOnce(() => {
            const knife = this.leftHand.children[0];
            if(!knife) return;
            if (knife.children[0])
                knife.children[0].destroy();
        }, 0.05)
    }
}