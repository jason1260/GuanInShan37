// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { notstart } from "./GM_boss";

@ccclass
export default class boss extends cc.Component {
    @property(cc.Prefab)
    energyBallPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    energyBallDefendPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    thunderAimPrefab: cc.Prefab = null;

    attackingTarget: cc.Node = null;

    anim: cc.Animation = null;

    walkingTimer = 0;
    flashTimer = 0;
    EnergyballTimer = 0;
    chaseBallTimer = 0;
    lighteningTimer = 0;
    turnBackTimer = 0;
    nearingTimer = 0;

    camera: cc.Node = null;
    public direction = null;

    flashCD: number = 10;
    EnergyballCD: number = 3;
    chaseBallCD: number = 5;
    lighteningCD: number = 2;
    turnBackCD: number = 6;
    walkingCD: number = 1;

    Energyballsp: number = 3;
    chaseballsp: number = 300;
    lighteningsp: number = 100;

    chaseBallhurt: number = 6;
    Energyballhurt: number = 6;
    lighteninghurt: number = 6;

    angryflashRadius: number = 200;
    safeRadius: number = 1000;
    enemyDistance: number = 0;

    EnergyballTrackRadius: number = 60;

    isflashed = false;
    canTurnback = true;
    turnbackPos = cc.v2(0, 0);

    isAngry = false;
    isAngryFlag = false;
    angryBonus = 1.5;
    angryHpPercent = 0.3;

    public walkTime: number = 0;
    public speed: number = 300;
    walkRadius = 400;

    public HP: number = 400;
    totalHP: number = 0;

    greedyflag = true;

    public isReleasing: boolean = false;

    moveDirection = cc.v2(0, 0);

    isDie = false;

    angryColor = null;

    isrealsingChaseBall = false;

    onLoad() {
        this.camera = cc.find("Canvas/Main Camera");
        this.totalHP = this.HP;
        this.angryColor = new cc.Color(240, 108, 108);
        this.anim = this.node.getComponent(cc.Animation);
    }

    start() {
    }

    update(dt) {
        if (notstart) return;
        if (this.isDie) {
            return;
        }

        if (this.HP <= 0) {
            this.isDie = true;
            this.attackingTarget = null;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.die();
            return;
        }

        if (!this.attackingTarget) {
            this.attackingTarget = cc.find("Canvas/Main Camera/player");
            if (!this.attackingTarget) return;
        }

        if (this.HP <= this.totalHP * this.angryHpPercent && !this.isAngryFlag) {
            this.isAngryFlag = true;
            console.log("angryyyyyyyyyyyy")
            this.angry();
        }

        this.detectEnemy(this.attackingTarget, this.camera);
        this.walking(dt);
        this.attacking(dt);
    }

    angry() {
        this.isAngry = true;
        this.EnergyballCD = Math.floor(this.EnergyballCD / this.angryBonus);
        this.flashCD = Math.floor(this.flashCD / (this.angryBonus * 3));
        this.EnergyballCD = Math.floor(this.EnergyballCD / this.angryBonus);
        this.chaseBallCD = Math.floor(this.chaseBallCD / this.angryBonus);
        this.lighteningCD = Math.floor(this.lighteningCD / (this.angryBonus));
        this.turnBackCD = Math.floor(this.turnBackCD / this.angryBonus);
        this.chaseBallhurt = Math.floor(this.chaseBallhurt * this.angryBonus);
        this.Energyballhurt = Math.floor(this.Energyballhurt * this.angryBonus);
        this.lighteninghurt = Math.floor(this.lighteninghurt * this.angryBonus);
        this.Energyballsp = Math.floor(this.Energyballsp * this.angryBonus);
        this.chaseballsp = Math.floor(this.chaseballsp * this.angryBonus);
        this.lighteningsp = Math.floor(this.lighteningsp * this.angryBonus);

        this.canTurnback = false;

        this.changeColor();
    }

    changeColor() {
        this.node.color = this.angryColor;
    }

    detectEnemy(Target: cc.Node, camera) {
        const playerPos = this.node.getPosition();
        const targetPos = Target.getPosition();

        // 计算方向向量和距离
        this.direction = targetPos.sub(playerPos);
        this.enemyDistance = this.direction.mag();
    }

    walking(dt) {
        if (this.isrealsingChaseBall) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        if (this.enemyDistance < this.angryflashRadius) {
            if (this.isflashed)
                this.greedyflag = true;
            else
                this.greedyflag = false;
        }
        if (this.enemyDistance > this.angryflashRadius && this.enemyDistance < this.safeRadius) {
            if (this.isflashed)
                this.greedyflag = true;
            else
                this.greedyflag = false;
        }

        else if (this.enemyDistance > this.safeRadius) {
            this.greedyflag = true;
        }

        // console.log("this.greedyflag", this.greedyflag)
        this.greedy(this.greedyflag, dt, this.walkingCD);
    }

    greedy(greedyflag, dt: number, updatePeriod: number) {

        this.walkingTimer += dt;
        if (this.walkingTimer >= updatePeriod) {
            this.walkingTimer = 0;
            const playerPos = this.node.getPosition();

            let sampledPos = this.getRandomInCircle_polar_better(0, this.walkRadius, this.attackingTarget);
            // 计算方向向量和距离
            let Direction = sampledPos.sub(playerPos);
            this.moveDirection = Direction.normalize();
        }
        // console.log("enemyDistance", moveDirection);
        // this.walkingTimer = 0;
        // cc.log(this.direction)
        // 计算移动速度
        // const moveDistance = Math.min(this.speed * dt, this.enemyDistance);

        // 更新节点位置
        if (greedyflag)
            this.node.getComponent(cc.RigidBody).linearVelocity = this.moveDirection.mul(this.speed);
        else
            this.node.getComponent(cc.RigidBody).linearVelocity = this.moveDirection.mul(this.speed * -1);

    }

    attacking(dt) {
        this.flashTimer += dt;
        this.EnergyballTimer += dt;
        this.chaseBallTimer += dt;
        this.lighteningTimer += dt;

        if ((this.flashTimer >= this.flashCD && this.enemyDistance > this.safeRadius) || (this.flashTimer >= this.flashCD && this.isAngry)) {
            this.flashTimer = 0;
            this.isflashed = true;
            if (this.canTurnback)
                this.turnbackPos = this.node.getPosition();
            this.flash(dt);
        }

        if (this.EnergyballTimer >= this.EnergyballCD) {
            this.EnergyballTimer = 0;
            this.generateAroundBall(this.Energyballhurt, this.Energyballsp);
        }

        if (this.chaseBallTimer >= this.chaseBallCD) {
            this.chaseBallTimer = 0;
            this.isrealsingChaseBall = true;
            this.generateChaseBall(this.chaseBallhurt, this.chaseballsp)
            this.scheduleOnce(() => { this.isrealsingChaseBall = false; }, 0.7);
        }

        if (this.lighteningTimer >= this.lighteningCD) {
            this.lighteningTimer = 0;
            let radius = (this.isAngry) ? 80 * Math.sqrt(this.HP) : 5 * Math.sqrt(this.HP);
            let thunderPos = this.getRandomInCircle_polar_better(0, radius, this.attackingTarget)
            this.generateThunder(this.lighteninghurt, thunderPos)
        }

        if (this.canTurnback && this.isflashed) {
            this.turnback(dt);
        }

    }

    flash(dt) {
        const dest = this.getRandomInCircle_polar_better(this.EnergyballTrackRadius, this.angryflashRadius, this.attackingTarget);
        this.anim.playAdditive('boss-flash');
        this.scheduleOnce(() => { this.node.setPosition(dest); }, 0.65);
        // this.node.setPosition(dest);
    }

    turnback(dt) {
        this.turnBackTimer += dt;
        if (this.turnBackTimer >= this.turnBackCD && this.isflashed) {
            this.turnBackTimer = 0;
            this.anim.playAdditive('boss-flash');
            this.scheduleOnce(() => { this.node.setPosition(this.turnbackPos); }, 0.65);
            // this.node.setPosition(this.turnbackPos);
            this.isflashed = false;
        }
    }

    generateAroundBall(attackNum: number, speed: number) {
        //CD
        this.isReleasing = true;
        this.schedule(() => { this.isReleasing = false; }, 0.1);
        //
        console.log("generate1")

        const energyBall = cc.instantiate(this.energyBallDefendPrefab);
        energyBall.getComponent('energy_ball').setProperty(attackNum, speed, this.node, 1)
        this.node.insertChild(energyBall, 0);
        energyBall.setPosition(new cc.Vec2(-42, 42));
        // this.anim.playAdditive('boss-around');
    }

    generateChaseBall(attackNum: number, speed: number) {
        //CD
        this.isReleasing = true;
        this.schedule(() => { this.isReleasing = false; }, 0.3);
        //
        let playerList = cc.find("Canvas/Main Camera").children;
        playerList = playerList.filter((child) => child.group == "player")
        const randomIndex = Math.floor(Math.random() * playerList.length);
        let targetplayer = playerList[randomIndex];
        if (!targetplayer) null;
        // this.isReleasing = true;
        // this.schedule(()=>{this.isReleasing = false;},0.1);
        // console.log("generate2")

        const energyBall = cc.instantiate(this.energyBallPrefab);
        energyBall.getComponent('energy_ball').setProperty(attackNum, speed, this.node, 2, targetplayer);

        this.anim.playAdditive('boss-attack');
        var offset = cc.v2(-50, 55);
        var newPosition = this.node.getPosition().add(offset);

        energyBall.setPosition(newPosition);
        this.node.parent.addChild(energyBall);
    }

    generateThunder(attackNum: number, position: cc.Vec2) {
        console.log("generateThunder")
        //CD
        this.isReleasing = true;
        this.schedule(() => { this.isReleasing = false; }, 0.1);
        //
        const thunder = cc.instantiate(this.thunderAimPrefab);
        thunder.getComponent('thunder').setProperty(attackNum, this.node, position)
        thunder.setPosition(position.add(this.node.parent.getPosition()));
        console.log(thunder.getPosition())

        // index 1 =>在scene後面
        this.node.parent.parent.insertChild(thunder, 1);

    }

    hurt(hurtNum: number) {
        this.HP -= hurtNum;
        this.bleedAnim(hurtNum);

        // 将节点颜色设置为白色
        if (this.HP <= this.totalHP * this.angryHpPercent && !this.isAngryFlag) {
            this.isAngryFlag = true;
            console.log("angryyyyyyyyyyyy")
            this.angry();
        }


        // 将节点颜色设置为白色
        let originColor = (this.isAngry) ? this.angryColor : cc.Color.WHITE;
        this.node.color = cc.Color.RED;

        // 创建显示文字的节点
        let textNode = new cc.Node();
        textNode.addComponent(cc.Label);
        let label = textNode.getComponent(cc.Label);
        label.string = "-" + hurtNum.toString();
        label.fontSize = 20;
        label.node.color = cc.Color.RED;
        textNode.setPosition(this.node.getPosition().add(cc.v2(0, 20))); // 设置文字节点位置
        this.node.parent.addChild(textNode);

        // 淡入淡出效果并向右飘移
        let moveAction = cc.moveBy(0.5, cc.v2(10, 10)); // 控制向右飘移的距离和时间
        let fadeIn = cc.fadeIn(0.1);
        let fadeOut = cc.fadeOut(0.1);
        let delay = cc.delayTime(0.1);
        let sequence = cc.sequence(fadeIn, delay, fadeOut, cc.removeSelf());
        let spawn = cc.spawn(moveAction, sequence);
        textNode.runAction(spawn);

        // 延迟0.05秒后恢复原样
        this.scheduleOnce(() => {
            this.node.color = originColor; // 恢复原来的颜色（假设原来的颜色为白色）
        }, 0.02);

    }

    bleedAnim(hurtNum: number) {
        // 创建血迹精灵节点
        let bloodNode = new cc.Node();
        let bloodSprite = bloodNode.addComponent(cc.Sprite);
        // 加载血迹纹理
        cc.resources.load("bleeding", cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error("加载血迹纹理失败：", err);
                return;
            }
            // 设置血迹精灵的纹理
            bloodSprite.spriteFrame = spriteFrame;
            // 设置血迹精灵的颜色为红色
            bloodSprite.node.color = cc.Color.BLUE;
            // 设置血迹精灵的初始缩放
            bloodSprite.node.scale = Math.sqrt(hurtNum) * 0.1;
            // 设置血迹精灵节点的初始位置
            bloodNode.setPosition(this.node.getPosition().add(this.node.parent.getPosition()));
            let randomAngle = cc.misc.degreesToRadians(Math.random() * 360);
            bloodNode.angle = cc.misc.radiansToDegrees(randomAngle);
            // 将血迹精灵节点添加到父节点
            const nodeIndex = this.node.parent.getSiblingIndex();
            this.node.parent.parent.insertChild(bloodNode, nodeIndex);
            // this.node.parent.parent.addChild(bloodNode);

            // 创建血迹淡出动画
            let fadeOut = cc.fadeOut(1);
            // 创建动画完成后的回调函数，用于销毁血迹精灵节点
            let callback = cc.callFunc(() => {
                bloodNode.destroy();
            });
            // 创建动作序列，先进行淡出动画再执行回调函数销毁节点
            let sequence = cc.sequence(fadeOut, callback);
            // 运行动作序列
            bloodNode.runAction(sequence);
        });
    }

    getRandomInCircle_polar_better(radius2, radius1, Target: cc.Node) {
        let l = radius1 - radius2;
        let length = radius2 + Math.sqrt(Math.random()) * l;
        let angle = Math.random() * 2 * Math.PI;
        // 然後將極座標轉成xy座標的Point
        let point = this.polarToXY(length, angle);
        // 然後再把點平移到以center為圓心
        // 将鼠标坐标转换为玩家节点的本地坐标系


        point.x += Target.getPosition().x;
        point.y += Target.getPosition().y;
        // 最後把這個point傳出去就行了
        return point;
    }

    polarToXY(length, angle) {
        const x = length * Math.cos(angle);
        const y = length * Math.sin(angle);
        return cc.v2(x, y);
    }

    die() {
        // 创建淡出动画
        let fadeOut = cc.fadeOut(0.5);
        // 创建动画完成后的回调函数
        let callback = cc.callFunc(() => {
            this.node.destroy();
        });
        // 创建动作序列，先淡出再执行回调函数销毁节点
        let sequence = cc.sequence(fadeOut, callback);

        this.node.stopAllActions();
        // 运行动作序列
        this.node.runAction(sequence);
    }
}
