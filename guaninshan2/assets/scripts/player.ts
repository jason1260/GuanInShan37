// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
const Input = {}

export var weapon;

@ccclass
export default class Player extends cc.Component {

    @property()
    speed: number = 100;
    @property()
    jumpSpeed: number = 100;

    @property()
    rotateSpeed: number = 300;

    @property(cc.Node)
    leftHand: cc.Node = null;
    @property(cc.Prefab)
    gunPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    knifePrefab: cc.Prefab = null;


    public lv: cc.Vec2 = null;
    public sp: cc.Vec2 = new cc.Vec2(0, 0);
    public isJumping: boolean = false;
    public dirAngle: number = 0;
    public life: number = 1;
    public shootRadius = 20;
    public isMouseUp: boolean = true;
    public transform_state: cc.AnimationState = null
    public prev_lv: cc.Vec2 = null;
    // LIFE-CYCLE CALLBACKS:
    public LIFE: number = 0;
    public score: number = 0;
    public state: string = 'ing';
    public Handstate: string = 'knife';
    public tmpWeapon: string = '';
    public nextWeapon: string = 'gun'
    public mousePt: cc.Vec2 = cc.v2(0, 0)

    onLoad() {
        for (var member in Input) delete Input[member];
        this.score = 0;
        this.state = 'ing';
        this.life = 1;
        this.isJumping = false;
        this.isMouseUp = true;
        weapon = "knife";
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.find("Canvas/scene1/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene1/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
    }


    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    update(dt) {


        let scaleX = Math.abs(this.node.scaleX);
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        //change weapon
        if (Input[cc.macro.KEY.q]) {
            if (this.Handstate !== 'changing')
                this.changeWeapon();
        }

        //move
        if (Input[cc.macro.KEY.a]) {
            this.sp.x = -1;
        } else if (Input[cc.macro.KEY.d]) {
            this.sp.x = 1;
        } else {
            this.sp.x = 0;
        }
        if (Input[cc.macro.KEY.w]) {
            this.sp.y = 1;

        } else if (Input[cc.macro.KEY.s]) {
            this.sp.y = -1;
        } else {
            this.sp.y = 0;
        }



        //move
        if(this.sp.x != 0 && this.sp.y != 0){
            this.sp.x *= 0.7;
            this.sp.y *= 0.7;
        }

        if (this.sp.x) {
            this.lv.x = this.sp.x * this.speed;
        } else {
            this.lv.x = 0;
        }
        if (this.sp.y) {
            this.lv.y = this.sp.y * this.jumpSpeed;
        } else {
            this.lv.y = 0;
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;

        //anime




    }
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {



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
        this.shootRadius = this.rescaleValue(distance, 1, 1000, 10, 50)
    }
    
    changeWeapon() {
        this.deleteWeapon()
        this.tmpWeapon = this.nextWeapon;
        this.nextWeapon = this.Handstate;
        this.Handstate = 'changing'
        this.scheduleOnce(() => {
            this.Handstate = this.tmpWeapon; 
            this.addWeapon();
        }, 1)
        if (weapon == "knife") weapon = "gun";
        else weapon = "knife";
    }
    deleteWeapon(){
        this.leftHand.destroyAllChildren();
    }
    addWeapon(){
        switch (this.Handstate) {
            case "gun":
                const gun = cc.instantiate(this.gunPrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(gun)
                break;
            case "knife":
                const knife = cc.instantiate(this.knifePrefab);
                /* const parentNode = this.node.parent; */
                this.leftHand.addChild(knife)
                break;
            default:
                break;
        }
    }

}
