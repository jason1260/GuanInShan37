// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class boss extends cc.Component {

    
    @property(cc.Prefab)
    thunderAimPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    energyBallPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    energyBallDefendPrefab: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:
    public lv: cc.Vec2 = new cc.Vec2(0, 0);
    public sp: cc.Vec2 = new cc.Vec2(0, 0);

    public walkTime:number = 0;
    public speed:number = 50;
    public HP:number = 500;
    public TargetNode:cc.Node = null;

    public isReleasing:boolean = false;

    onLoad () {
        this.randWakl();
    }

    start () {
        this.generateThunder(0,this.node.getPosition().add(cc.v2(80,80)))
    }

    update (dt) {
        let randomAction = Math.random();
        if(randomAction<0.01 && ! this.isReleasing){
            /* this.generateAroundBall(1,3) */
            /* this.generateChaseBall(1,300) */
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

    }
    generateAroundBall(attackNum: number,speed: number){ 
        //CD
        this.isReleasing = true;
        this.schedule(()=>{this.isReleasing = false;},0.1);
        //


        const energyBall = cc.instantiate(this.energyBallDefendPrefab);
        energyBall.getComponent('energy_ball').setProperty(attackNum,speed,this.node,1)
        this.node.insertChild(energyBall, 0);
        energyBall.setPosition(new cc.Vec2(0,-60));
    }
    generateChaseBall(attackNum: number,speed: number){
        //CD
        this.isReleasing = true;
        this.schedule(()=>{this.isReleasing = false;},0.1);
        //
        let playerList = cc.find("Canvas/Main Camera").children;
        playerList = playerList.filter((child) => child.group == "player")
        const randomIndex = Math.floor(Math.random() * playerList.length);
        let targetplayer =  playerList[randomIndex];
        if(!targetplayer) null;
        this.isReleasing = true;
        this.schedule(()=>{this.isReleasing = false;},0.1);

        const energyBall = cc.instantiate(this.energyBallPrefab);
        energyBall.getComponent('energy_ball').setProperty(attackNum,speed,this.node,2,targetplayer)
        energyBall.setPosition(this.node.getPosition());
        this.node.parent.addChild(energyBall);
    }
    generateThunder(attackNum: number,position: cc.Vec2){
        console.log("generateThunder")
        //CD
        this.isReleasing = true;
        this.schedule(()=>{this.isReleasing = false;},0.1);
        //
        const thunder = cc.instantiate(this.thunderAimPrefab);
        thunder.getComponent('thunder').setProperty(attackNum,this.node,position)
        thunder.setPosition(position.add(this.node.parent.getPosition()));
        console.log(thunder.getPosition())
        
        // index 1 =>在scene後面
        this.node.parent.parent.insertChild(thunder,1);

    }
    randWakl(){
        
        this.walkTime = Math.random() * 3 + 3
        let randomAction = Math.random();
        if (randomAction < 0.33) {
            this.sp.x = 1;
        } else if (randomAction < 0.66) {
            this.sp.x = -1;
        } else{
            this.sp.x = 0;
        }
        randomAction = Math.random();
        if (randomAction < 0.33) {
            this.sp.y = 1;
        } else if (randomAction < 0.66) {
            this.sp.y = -1;
        } else {
            this.sp.y = 0;
        }

        
        this.scheduleOnce(()=>{this.randWakl()},this.walkTime)
    }
    hurt(hurtNum: number) {
        this.HP -= hurtNum;
        this.bleedAnim(hurtNum);

        // 将节点颜色设置为白色
        let originColor = cc.Color.WHITE;
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
}
