// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import gameInfo = require("./gameInfo");
const { ccclass, property } = cc._decorator;
const Input = {}

@ccclass
export default class Player extends cc.Component {





    leftHand: cc.Node = null;
    @property(cc.Prefab)
    gunPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    knifePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    stickPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    riflePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    sniperPrefab: cc.Prefab = null;

    public GM = null;

    public speed: number = 200;
    public rotateSpeed: number = 30;
    public HP: number = 100;
    public role: string = 'selling';
    public bulletNum: number = 20;
    public score: number = 0;

    public baseSpeed: number = 200;
    public lv: cc.Vec2 = null;
    public sp: cc.Vec2 = new cc.Vec2(0, 0);
    public dirAngle: number = 0;
    public shootRadius = 20;
    // LIFE-CYCLE CALLBACKS:
    public Handstate: string = 'knife';
    public tmpWeapon: string = '';
    public nextWeapon: string = 'gun'
    public mousePt: cc.Vec2 = cc.v2(0, 0);
    public onIce: boolean;
    public onMud: boolean;
    public iceCounter: number;
    public moving: boolean;

    onLoad() {
        // console.log("player onLoad")
        this.leftHand = this.node.getChildByName("leftHand");
        cc.resources.load(`role/${this.role}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error("加载图像资源失败：", err);
                return;
            }
            // console.log(spriteFrame)
            // 获取 Sprite 组件
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

        });
        this.HP = gameInfo.roleHP[this.role]
        this.baseSpeed = gameInfo.roleSpeed[this.role]



        for (var member in Input) delete Input[member];
        this.score = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.GM = cc.find("Canvas/GM").getComponent('GM');

        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
        this.onMud = false;
    }


    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    update(dt) {

        //die
        if (this.HP < 0)
            this.playerDie();
        //update speed
        if (this.Handstate !== 'changing' && this.Handstate !== 'reloading')
            this.speed = this.baseSpeed - gameInfo.weaponWeight[this.Handstate];

        let scaleX = Math.abs(this.node.scaleX);
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        //change weapon
        if (Input[cc.macro.KEY.q]) {
            if (this.Handstate !== 'changing' && this.Handstate !== 'reloading') {
                this.changeWeapon();
            }
        }
        //reload
        if (Input[cc.macro.KEY.r]) {
            if (gameInfo.rangedWeapon.includes(this.Handstate))
                this.reload();

        }
        //move
        if (Input[cc.macro.KEY.a]) {
            this.moving = true;
            if (this.onIce) this.sp.x = -2;
            else this.sp.x = -1;
        } else if (Input[cc.macro.KEY.d]) {
            this.moving = true;
            if (this.onIce) this.sp.x = 2;
            else this.sp.x = 1;
        } else {
            this.moving = false;
            if (this.onIce) this.sp.x += (this.sp.x > 0) ? -0.02 : 0.02;
            else this.sp.x = 0;
        }
        if (Input[cc.macro.KEY.w]) {
            this.moving = true;
            if (this.onIce) this.sp.y = 2;
            else this.sp.y = 1;
        } else if (Input[cc.macro.KEY.s]) {
            this.moving = true;
            if (this.onIce) this.sp.y = -2;
            else this.sp.y = -1;
        } else {
            this.moving = false;
            if (this.onIce) this.sp.y += (this.sp.y > 0) ? -0.02 : 0.02;
            else this.sp.y = 0;
        }



        //move
        if (this.onMud) this.sp.x *= 0.8, this.sp.y *= 0.8;
        if (this.moving && this.sp.x != 0 && this.sp.y != 0) {
            this.sp.x *= 0.7;
            this.sp.y *= 0.7;
        }

        if (this.sp.x) {
            this.lv.x = this.sp.x * this.speed;
        } else {
            this.lv.x = 0;
        }
        if (this.sp.y) {
            this.lv.y = this.sp.y * this.speed;
        } else {
            this.lv.y = 0;
        }
        // console.log(this.iceCounter)
        if (this.onIce && this.iceCounter >= 10) {
            this.onIce = false;
            this.iceCounter = -1
        }
        if (this.iceCounter >= 0)
            this.iceCounter++;
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;

        //anime

    }

    onCollisionExit(otherCollider, selfCollider) {
        // console.log(otherCollider.node.group)
        if (otherCollider.node.group == 'ice') {
            this.iceCounter = 0;
        } else if (otherCollider.node.group == 'mud') this.onMud = false;
    }

    //pick up drops
    onCollisionStay(otherCollider, selfCollider) {
        if (otherCollider.node.group == 'ice') {
            this.iceCounter = -1;
            this.onIce = true;
        } else if (otherCollider.node.group == 'mud') this.onMud = true;

        if (otherCollider.node.group != 'drops') return
        if (this.Handstate == 'changing' || this.Handstate == 'reloading')
            return;
        if (Input[cc.macro.KEY.space]) {
            this.generateDrops(this.Handstate)
            this.Handstate = gameInfo.dropsTag2weapon[otherCollider.getComponent(cc.BoxCollider).tag]
            this.deleteWeapon();
            this.addWeapon();
            otherCollider.node.destroy();
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate]
        }

    }
    generateDrops(weaponType: string) {
        this.scheduleOnce(() => {
            cc.resources.load(`Prefab/${weaponType}Drop`, cc.Prefab, (err, prefab) => {
                if (err) {
                    console.log("沒辦法大便");
                    return;
                }
                const newNode = cc.instantiate(prefab);
                newNode.position = this.node.position.add(this.node.parent.position);
                const nodeIndex = this.node.parent.getSiblingIndex();
                this.node.parent.parent.insertChild(newNode, nodeIndex);
            });
        }, 0.3)
    }

    onKeyDown(e) {

        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
    }

    setAni(anime) {

    }
    rescaleValue(value: number, min1: number, max1: number, min2: number, max2: number): number {
        // 将 value 从范围 min1 到 max1 映射到范围 min2 到 max2
        const percent = (value - min1) / (max1 - min1);
        const scaledValue = percent * (max2 - min2) + min2;
        return scaledValue;
    }
    onMouseMove(event: cc.Event.EventMouse) {
        const camera = cc.find("Canvas/Main Camera")
        let mousePos = event.getLocation().add(camera.getPosition());
        let playerPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let direction = mousePos.sub(playerPos);
        let angle = cc.v2(1, 0).signAngle(direction);
        let degree = cc.misc.radiansToDegrees(angle);
        this.dirAngle = degree;
        this.node.angle = degree;

        mousePos = event.getLocation();

        // 将鼠标坐标转换为玩家节点的本地坐标系
        const playerLocalPos = this.node.parent.convertToNodeSpaceAR(mousePos).add(camera.getPosition());

        // 在玩家节点的本地坐标系中操作

        this.mousePt = playerLocalPos
        const distance: number = cc.Vec2.distance(this.node.getPosition(), playerLocalPos);
        this.shootRadius = this.rescaleValue(distance, 1, 1000, 10, 50) * gameInfo.weaponRadius[this.Handstate]
    }

    changeWeapon() {
        this.deleteWeapon();
        this.GM.playeffect('changing');
        this.tmpWeapon = this.nextWeapon;
        this.nextWeapon = this.Handstate;
        this.Handstate = 'changing'
        this.scheduleOnce(() => {
            this.Handstate = this.tmpWeapon;
            this.addWeapon();
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate]
        }, 1)

    }
    deleteWeapon() {
        this.leftHand.destroyAllChildren();
    }
    addWeapon() {
        // console.log(this.Handstate)
        switch (this.Handstate) {
            case "gun":
                const gun = cc.instantiate(this.gunPrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(gun)
                break;
            case "rifle":
                const rifle = cc.instantiate(this.riflePrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(rifle)
                break;
            case "sniper":
                const sniper = cc.instantiate(this.sniperPrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(sniper)
                break;
            case "knife":
                const knife = cc.instantiate(this.knifePrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(knife)
                break;
            case "stick":
                const stick = cc.instantiate(this.stickPrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(stick)
                break;
            default:
                break;
        }
    }
    reload() {
        this.tmpWeapon = this.Handstate;
        this.Handstate = 'reloading';
        this.GM.playeffect('reload');
        this.scheduleOnce(() => {
            this.Handstate = this.tmpWeapon;
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate]
        }, 1)

    }
    hurt(hurtNum: number) {
        this.HP -= hurtNum;
        this.bleedAnim(hurtNum);

        // 将节点颜色设置为白色
        let originColor = this.node.color;
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
    playerDie() {
        cc.director.loadScene("Select");
    }
    setRole(role: string) {
        this.role = role;
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
            bloodSprite.node.color = cc.Color.RED;
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
}
