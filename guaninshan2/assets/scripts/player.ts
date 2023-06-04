// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
const Input={}

@ccclass
export default class Player extends cc.Component {

    @property()
    speed: number = 100;
    @property()
    jumpSpeed: number = 100;

    @property()
    rotateSpeed: number = 300;
    


    public lv:cc.Vec2 = null;
    public sp:cc.Vec2 = new cc.Vec2(0,0);
    public isJumping: boolean = false;
    public dirAngle:number = 0;
    public life:number = 1; 
    public shootRadius = 20;
    public isMouseUp:boolean = true;
    public transform_state:cc.AnimationState = null
    public prev_lv:cc.Vec2 = null;
    // LIFE-CYCLE CALLBACKS:
    public LIFE:number = 0;
    public score:number = 0;
    public state:string = 'ing';
    public Handstate:string = 'knife';
    public tmpWeapon:string = '';
    public nextWeapon:string = 'gun'

    onLoad () {
        for (var member in Input) delete Input[member];
        this.score = 0;
        this.state = 'ing';
        this.life = 1;
        this.isJumping = false;
        this.isMouseUp = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.Canvas.instance.node.on('mousemove', this.onMouseMove, this);
    }
    
   

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    start () {

    }

    update (dt) {
        

        let scaleX = Math.abs(this.node.scaleX);
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        //change weapon
        if(Input[cc.macro.KEY.q]){
            if(this.Handstate !== 'changing')
                this.changeWeapon();
        }

        //move
        if(Input[cc.macro.KEY.a]){
            console.log('dfd')
            this.sp.x = -1;
        }else if(Input[cc.macro.KEY.d]){
            this.sp.x = 1;
        }else {
            this.sp.x = 0;
        }
        if(Input[cc.macro.KEY.w]){
            this.sp.y = 1;
          
        }else if(Input[cc.macro.KEY.s]){
            this.sp.y = -1;
        }else{
            this.sp.y = 0;
        }
            
        
       
        //move
        if(this.sp.x){
            this.lv.x = this.sp.x * this.speed;
        }else{
            this.lv.x = 0;
        }
        if(this.sp.y){
            this.lv.y = this.sp.y * this.jumpSpeed;
        }else{
            this.lv.y = 0;
        }
        console.log(this.lv.x)
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

    setAni(anime){
        
    }
    onMouseMove(event: cc.Event.EventMouse) {
        let mousePos = event.getLocation();
        let playerPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let direction = mousePos.sub(playerPos);
        let angle = cc.v2(1, 0).signAngle(direction);
        let degree = cc.misc.radiansToDegrees(angle);
        this.dirAngle = degree;
        this.node.angle = degree;
 
        
    }
    changeWeapon(){
        this.tmpWeapon = this.nextWeapon;
        this.nextWeapon = this.Handstate;
        this.Handstate = 'changing'
        this.scheduleOnce(()=>{this.Handstate = this.tmpWeapon; console.log('change over')},1)
    }

}
