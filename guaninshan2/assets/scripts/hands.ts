// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import gameInfo = require("./gameInfo");
export var knife_valid;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    leftHand: cc.Node = null;

    @property(cc.Node)
    rightHand: cc.Node = null;
    @property(cc.Node)
    cursor: cc.Node = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab

    public GM = null;


    public rightAngle: number = -45;
    public leftAngle: number = 45;
    public rightRadius: number = 25;
    public leftRadius: number = 25;
    public playerTs = null;
    public mousePt: cc.Vec2 = cc.v2(0, 0);
    public bulletVelocity: number = 1000;

    public timer: number = 0;
    public attacking: boolean = false;
    public onFloor: number = 1;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this)
        this.playerTs = this.node.getComponent('player');
        this.GM = cc.find("Canvas/GM").getComponent('GM');
        knife_valid = false;
    }

    start() {

    }

    update(dt) {
        if (this.playerTs.Handstate == 'changing' || this.playerTs.Handstate == 'reloading')
            this.changingAni()
        if (this.playerTs.Handstate != 'reloading' && this.playerTs.Handstate != 'changing' && !this.attacking)
            this.idleAni()
        this.HandPos();
        /* console.log(this.playerTs.Handstate) */
    }

    onCollisionStay (other, self) {
        if (other.node.group === 'secFloor') this.onFloor = 2;
    }

    onCollisionExit (other, self) {
        if (other.node.group === 'secFloor') this.onFloor = 1;
    }

    attack() {
        if (this.playerTs.Handstate === 'changing' || this.attacking || this.playerTs.Handstate == 'reloading') return;
        this.attacking = true;
        
        switch (this.playerTs.Handstate) {
        case 'rifle':
        case 'sniper':
        case 'gun':
            this.shoot();
            this.scheduleOnce(() => {
              this.attacking = false;
            }, gameInfo.weaponAttackTime[this.playerTs.Handstate]);
            break;
            
        case 'knife':
            this.leftAngle = 0;
            knife_valid = true;

            this.GM.playeffect(this.playerTs.Handstate);
      
            // 逐渐改变角度的函数
            const rotateAngle = (targetAngle: number, duration: number) => {
              const startAngle = this.leftAngle;
              let elapsedTime = 0;
              const interval = gameInfo.weaponAttackTime[this.playerTs.Handstate]; // 每帧间隔时间，可根据需要调整
      
              const update = () => {
                elapsedTime += interval;
                const t = Math.min(elapsedTime / duration, 1); // 插值参数
      
                // 根据插值参数 t 计算当前角度
                this.leftAngle = cc.misc.lerp(startAngle, targetAngle, t);
      
                if (t >= 1) {
                  // 动画结束后的操作
                  this.leftAngle = 45;
                  this.attacking = false;
                  knife_valid = false;
                } else {
                  // 继续更新角度
                  setTimeout(update, interval * 1000);
                }
              };
      
              update();
            };
      
            rotateAngle(45, 0.2); // 调用函数开始逐渐改变角度
      
            break;
      
          default:
            break;
        }
      }
      //在这个示例中，我添加了一个名为 rotateAngle 的函数，该函数用于逐渐改变角度。它接受目标角度和持续时间作为参数，并使用递归调用来实现逐帧更新角度直到达到目标角度为止。可以根据需要调整每帧的间隔时间 interval，以控制动画的流畅度。
      
      
      
      
    idleAni() {
        this.rightRadius = 25;
        this.leftRadius = 25;
        switch (this.playerTs.Handstate) {
            case 'sniper':
                this.leftAngle = 5
                this.rightRadius = 45
                this.rightAngle = -this.leftAngle;
                break;
            case 'rifle':
                this.leftAngle = 5
                this.rightRadius = 45
                this.rightAngle = -this.leftAngle;
                break;
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
    changingAni() {
        this.rightRadius = 25;
        this.leftRadius = 25;
        this.timer += 1;
        if (this.timer % 10 == 0) {
            if (this.leftAngle != 10)
                this.leftAngle = 10
            else
                this.leftAngle = 20
            this.rightAngle = -this.leftAngle;
        }
    }
    HandPos() {
        let angleInRadians = cc.misc.degreesToRadians(this.leftAngle);
        let xOffset = this.leftRadius * Math.cos(angleInRadians);
        let yOffset = this.leftRadius * Math.sin(angleInRadians);
        let ballCenter = cc.v2(0, 0); // 球心的坐标
        let handPosition = ballCenter.add(cc.v2(xOffset, yOffset));
        this.leftHand.setPosition(handPosition)
        angleInRadians = cc.misc.degreesToRadians(this.rightAngle);
        xOffset = this.rightRadius * Math.cos(angleInRadians);
        yOffset = this.rightRadius * Math.sin(angleInRadians);
        ballCenter = cc.v2(0, 0); // 球心的坐标
        handPosition = ballCenter.add(cc.v2(xOffset, yOffset));
        this.rightHand.setPosition(handPosition)
    }
    shoot() {
        if(this.playerTs.bulletNum <= 0) {
            this.GM.playeffect('empty');
            return;
        }
        this.playerTs.bulletNum -= 1;
        this.GM.playeffect(this.playerTs.Handstate);

        //這裡的radius和cursor的差兩倍
        const dest = this.getRandomInCircle_polar_better(this.playerTs.shootRadius);

        // 创建射线的起始点和终点

        const startPos = this.node.getPosition();
        // cc.log(startPos);
        const direction = dest.sub(startPos).normalize();
        const endPos = startPos.add(direction.mul(2000));

        // 创建射线的绘制节点
        const bullet = cc.instantiate(this.bulletPrefab);
        bullet.getComponent('bullet').setProperty(10,this.onFloor)
        console.log("floor: ", this.onFloor)
        console.log(bullet.getComponent('bullet').attackNum)
        /* const parentNode = this.node.parent; */
        const nodeIndex = this.node.children.indexOf(this.leftHand);
        this.node.insertChild(bullet, nodeIndex - 1);
        bullet.setPosition(new cc.Vec2(this.leftHand.position.x, this.leftHand.position.y));
        bullet.getComponent(cc.Collider).enabled = false;
        bullet.getComponent(cc.RigidBody).linearVelocity = direction.mul(this.bulletVelocity);
    }
    getRandomInCircle_polar_better(radius) {
        let length = Math.sqrt(Math.random()) * radius;
        let angle = Math.random() * 2 * Math.PI;
        // 然後將極座標轉成xy座標的Point
        let point = this.polarToXY(length, angle);
        // 然後再把點平移到以center為圓心
        // 将鼠标坐标转换为玩家节点的本地坐标系


        point.x += this.mousePt.x;
        point.y += this.mousePt.y;
        // 最後把這個point傳出去就行了
        return point;
    }
    polarToXY(length, angle) {
        const x = length * Math.cos(angle);
        const y = length * Math.sin(angle);
        return cc.v2(x, y);
    }
    onMouseMove(event: cc.Event.EventMouse) {
        // 更新空心圆圈的位置与鼠标位置一致
        const mousePos = event.getLocation();
        const camera = cc.find("Canvas/Main Camera")
        // 将鼠标坐标转换为玩家节点的本地坐标系
        const playerLocalPos = this.node.parent.convertToNodeSpaceAR(mousePos).add(camera.getPosition());

        // 在玩家节点的本地坐标系中操作

        this.mousePt = playerLocalPos
    }
}
