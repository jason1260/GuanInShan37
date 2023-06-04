// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

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


    public rightAngle: number = -45;
    public leftAngle: number = 45;
    public rightRadius: number = 25;
    public leftRadius: number = 25;
    public playerTs = null;
    public mousePt: cc.Vec2 = cc.v2(0, 0);
    public bulletVelocity: number = 1000;

    public timer: number = 0;
    public attacking: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.Canvas.instance.node.on('mousedown', this.attack, this);
        cc.Canvas.instance.node.on('mousedown', this.onMouseMove, this);
        cc.Canvas.instance.node.on('mousemove', this.onMouseMove, this);
        this.playerTs = this.node.getComponent('player');
    }

    start() {

    }

    update(dt) {
        if (this.playerTs.Handstate == 'changing')
            this.changingAni()
        if (this.playerTs.Handstate != 'changing' && !this.attacking)
            this.idleAni()
        this.HandPos();
        /* console.log(this.playerTs.Handstate) */
    }
    attack() {
        if (this.playerTs.Handstate == 'changing' || this.attacking) return;
        this.attacking = true
        switch (this.playerTs.Handstate) {
            case 'gun':
                this.shoot()
                this.scheduleOnce(() => {
                    this.attacking = false
                }, 0.2)
                break;
            case 'knife':
                this.leftAngle = 15;
                this.scheduleOnce(() => {
                    this.leftAngle = 45;
                    this.attacking = false
                }, 0.2)
                break;
            default:
                break;
        }


    }
    idleAni() {

        switch (this.playerTs.Handstate) {
            case 'gun':
                this.leftAngle = 15
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
        cc.log("shoot!!!!!!!!!!!!!!!!!!!!!");

        //這裡的radius和cursor的差兩倍
        const dest = this.getRandomInCircle_polar_better(this.playerTs.shootRadius);

        // 创建射线的起始点和终点

        const startPos = this.node.getPosition();
        // cc.log(startPos);
        const direction = dest.sub(startPos).normalize();
        const endPos = startPos.add(direction.mul(2000));

        // 创建射线的绘制节点
        const bullet = cc.instantiate(this.bulletPrefab);
        const parentNode = this.node.parent;
        const nodeIndex = parentNode.children.indexOf(this.node);
        parentNode.insertChild(bullet, nodeIndex - 1);
        bullet.setPosition(new cc.Vec2(this.node.position.x, this.node.position.y));
        bullet.getComponent(cc.Collider).enabled = false;
        bullet.getComponent(cc.RigidBody).linearVelocity = direction.mul(this.bulletVelocity);
        console.log(direction)
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

        // 将鼠标坐标转换为玩家节点的本地坐标系
        const playerLocalPos = this.node.parent.convertToNodeSpaceAR(mousePos);

        // 在玩家节点的本地坐标系中操作

        this.mousePt = playerLocalPos
    }
}
