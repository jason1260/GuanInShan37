// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Drop extends cc.Component {

    public baseScale:number = 0;
    public startPosY:number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.baseScale = this.node.scale;
        this. startPosY = this.node.getPosition().y; // 起始位置
        const endPosY = 1; // 目标位置
    }

    update (dt) {
        const duration = 0.6 ; // 变化持续时间（秒）
        // 创建一个移动动作，使用缓动函数来实现渐变效果
        if(this.node.getPosition().y == this.startPosY){
            const moveUpAction = cc.tween().to(duration, { y: this.startPosY+10 }, { easing: 'quadInOut' });
            const moveDownAction = cc.tween().to(duration, { y: this.startPosY }, { easing: 'quadInOut' });

            // 创建一个序列动作，包括先移动到目标位置再返回起始位置
            const sequenceAction = cc.tween().sequence(moveUpAction, moveDownAction);

            // 执行动作
            cc.tween(this.node).then(sequenceAction).start();
        }
        
       
    }
}
