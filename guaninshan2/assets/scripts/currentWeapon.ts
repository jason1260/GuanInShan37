const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    private currentWeapon: cc.Node = null;
    private nextWeapon: cc.Node = null;
    private canSwitchWeapon: boolean = true;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start() {
        this.currentWeapon = this.node.getChildByName("CurrentWeapon");
        this.nextWeapon = this.node.getChildByName("NextWeapon");
    }

    // update (dt) {
    //     this.currentWeapon = this.node.getChildByName("CurrentWeapon");
    //     this.nextWeapon = this.node.getChildByName("NextWeapon");
    // }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.q && this.canSwitchWeapon) {
            cc.log(this.currentWeapon.getComponent(cc.Sprite).spriteFrame);
            this.canSwitchWeapon = false;

            // 获取当前武器和下一个武器的中心位置
            const currentCenter = cc.v2(this.currentWeapon.position.x, this.currentWeapon.position.y);
            const nextCenter = cc.v2(this.nextWeapon.position.x, this.nextWeapon.position.y);

            // 计算弧形移动的路径
            const radius = currentCenter.sub(nextCenter).mag() / 2;
            const angle = Math.PI / 2;
            const startAngle = currentCenter.signAngle(nextCenter);
            const deltaAngle = angle * (Math.sign(startAngle) === 1 ? 1 : -1);
            const center = currentCenter.add(nextCenter).mul(0.5);

            // 创建动画并执行
            const duration = 0.2;
            const currentBezierTo = cc.bezierTo(duration, [
                currentCenter,
                cc.v2(currentCenter.x + radius * Math.cos(startAngle + deltaAngle), currentCenter.y + radius * Math.sin(startAngle + deltaAngle)),
                nextCenter
            ]);
            const nextBezierTo = cc.bezierTo(duration, [
                nextCenter,
                cc.v2(nextCenter.x + radius * Math.cos(startAngle - deltaAngle), nextCenter.y + radius * Math.sin(startAngle - deltaAngle)),
                currentCenter
            ]);
            const currentScaleTo = cc.scaleTo(duration, 4);
            const nextScaleTo = cc.scaleTo(duration, 3);
            const currentFadeTo = cc.fadeTo(duration, 255);
            const nextFadeTo = cc.fadeTo(duration, 100);

            // 创建回调函数，在动画结束后更新武器状态
            const updateWeaponStatus = cc.callFunc(() => {
                const temp = this.currentWeapon;
                this.currentWeapon = this.nextWeapon;
                this.nextWeapon = temp;
                cc.log(this.currentWeapon.getComponent(cc.Sprite).spriteFrame);
            });

            // 创建顺序动作序列
            const currentSequence = cc.sequence(cc.spawn(currentBezierTo,nextScaleTo, nextFadeTo), updateWeaponStatus);
            const nextSequence = cc.sequence(cc.spawn(nextBezierTo, currentScaleTo , currentFadeTo), cc.callFunc(() => {
                this.canSwitchWeapon = true;
            }));

            this.currentWeapon.runAction(currentSequence);
            this.nextWeapon.runAction(nextSequence);

        }
    }
}
