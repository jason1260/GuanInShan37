// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class thunder extends cc.Component {


    @property(cc.Prefab)
    thunderPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    public attackNum: number = 0;
    public selfNode:cc.Node = null;
    public target:cc.Vec2 = null;
    public camera =null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
        const duration = 1; // 动画持续时间，单位为秒
        // 创建一个渐变动作，将节点的 opacity 从 0 渐变到 1
        const fadeInAction = cc.tween().to(duration, { opacity: 200 });
        // 执行渐变动作
        cc.tween(this.node).then(fadeInAction).start();

        this.scheduleOnce(()=>{this.createBullet()},1)
        this.scheduleOnce(()=>{this.node.destroy()},1.5)
    }

    update (dt) {}

    setProperty(attackNum: number, selfNode:cc.Node, aim:cc.Vec2 = null){
        this.attackNum = attackNum + Math.floor((0.1 * Math.random() - 0.05) * 2 * attackNum);
        this.selfNode = selfNode;
        this.target = aim;
    }
    createBullet(){
        const bullet = cc.instantiate(this.bulletPrefab);
        bullet.opacity = 1;

        bullet.getComponent('bullet').setProperty(this.attackNum,1,this.selfNode)
        /* console.log(bullet.getComponent('bullet').attackNum) */

        
        bullet.setPosition(cc.v2(0,0));

        bullet.scale=2;

        

        bullet.getComponent(cc.Collider).enabled = false;
        this.node.addChild(bullet)
    }
}
