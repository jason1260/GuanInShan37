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


    

    @property(cc.Node)
    leftHand: cc.Node = null;
    @property(cc.Prefab)
    gunPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    knifePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    riflePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    sniperPrefab: cc.Prefab = null;

    public GM = null;

    public speed: number = 200;
    public rotateSpeed: number = 30;
    public HP:number = 100;
    public role: string = '少林';
    public bulletNum:number = 20;
    public score:number = 0;
    
    public baseSpeed: number = 200;
    public lv: cc.Vec2 = null;
    public sp: cc.Vec2 = new cc.Vec2(0, 0);
    public dirAngle: number = 0;
    public shootRadius = 20;
    // LIFE-CYCLE CALLBACKS:
    public Handstate: string = 'knife';
    public tmpWeapon: string = '';
    public nextWeapon: string = 'gun'
    public mousePt: cc.Vec2 = cc.v2(0, 0)

    onLoad() {
        for (var member in Input) delete Input[member];
        this.score = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.GM = cc.find("Canvas/GM").getComponent('GM');

        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
    }


    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    update(dt) {
      
        //die
        if(this.HP < 0)
            this.playerDie();
        //update speed
        if (this.Handstate !== 'changing' && this.Handstate !== 'reloading')
            this.speed = this.baseSpeed - gameInfo.weaponWeight[this.Handstate];

        let scaleX = Math.abs(this.node.scaleX);
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        //change weapon
        if (Input[cc.macro.KEY.q]) {
            if (this.Handstate !== 'changing' && this.Handstate !== 'reloading'){
                this.changeWeapon();
            }
        }
        //reload
        if (Input[cc.macro.KEY.r]) {     
            if(gameInfo.rangedWeapon.includes(this.Handstate))
                this.reload();
            
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
            this.lv.y = this.sp.y * this.speed;
        } else {
            this.lv.y = 0;
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;

        //anime




    }
    //pick up drops
    onCollisionStay(otherCollider, selfCollider) {
        if(otherCollider.node.group != 'drops') return
        if(this.Handstate == 'changing' || this.Handstate == 'reloading')
            return;
        if(Input[cc.macro.KEY.space]){
            this.Handstate = gameInfo.dropsTag2weapon[otherCollider.getComponent(cc.BoxCollider).tag]
            this.deleteWeapon();
            this.addWeapon();
            otherCollider.node.destroy();
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate]
        }

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
    deleteWeapon(){
        this.leftHand.destroyAllChildren();
    }
    addWeapon(){
        console.log(this.Handstate)
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
            default:
                break;
        }
    }
    reload(){
        this.tmpWeapon = this.Handstate;
        this.Handstate = 'reloading';
        this.GM.playeffect('reload');
        this.scheduleOnce(() => {
            this.Handstate = this.tmpWeapon; 
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate]
        }, 1)
        
    }
    hurt(hurtNum:number){
        this.HP -= hurtNum;
    }
    playerDie(){
        cc.director.loadScene(cc.director.getScene().name);
    }

}
