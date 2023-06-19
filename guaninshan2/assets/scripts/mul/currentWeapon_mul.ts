const { ccclass, property } = cc._decorator;
const Input = {}
const weaponIconScale = {
    knife: 4,
    stick: 4,
    gun: 4,
    rifle: 1,
    sniper: 0.2
}
const weaponIconSize = {
    knife: { w: 14, h: 13 },
    stick: { w: 14, h: 13 },
    gun: { w: 20, h: 20 },
    rifle: { w: 114, h: 36 },
    sniper: { w: 720, h: 220 }
}
@ccclass
export default class CurrentWeaponMul extends cc.Component {
    private currentWeapon: cc.Node = null;
    private nextWeapon: cc.Node = null;
    private canSwitchWeapon: boolean = true;
    private playerTs = null;
    mulRole: cc.Node = null;


    onLoad() {
        this.mulRole = cc.find("persistnode").getComponent("persistNode").mulRole
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // this.playerTs = cc.find('Canvas/Main Camera/player').getComponent('player');
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.playerTs = null;
    }

    start() {
        this.currentWeapon = this.node.getChildByName("CurrentWeapon");
        this.nextWeapon = this.node.getChildByName("NextWeapon");
    }

    update(dt) {
        if (!this.playerTs)
            this.playerTs = cc.find(`Canvas/Main Camera/player_${this.mulRole}`).getComponent('player');
        /* console.log(this.playerTs.Handstate) */
        /* console.log(this.currentWeapon.getComponent(cc.Sprite).spriteFrame.name) */
        if (this.playerTs.Handstate !== 'reloading' && this.playerTs.Handstate !== 'changing' && this.currentWeapon.getComponent(cc.Sprite).spriteFrame.name !== this.playerTs.Handstate && this.canSwitchWeapon) {
            /* cc.log(this.currentWeapon.getComponent(cc.Sprite).spriteFrame); */
            if (this.nextWeapon.getComponent(cc.Sprite).spriteFrame.name == this.playerTs.Handstate)
                this.swithcWeaponUI()
            else {
                cc.resources.load(`${this.playerTs.Handstate}`, cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        console.error("加载图像资源失败：", err);
                        return;
                    }
                    // console.log(spriteFrame)
                    // 获取 Sprite 组件
                    this.currentWeapon.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                    this.currentWeapon.scale = weaponIconScale[this.currentWeapon.getComponent(cc.Sprite).spriteFrame.name]
                    this.currentWeapon.width = weaponIconSize[this.currentWeapon.getComponent(cc.Sprite).spriteFrame.name].w
                    this.currentWeapon.height = weaponIconSize[this.currentWeapon.getComponent(cc.Sprite).spriteFrame.name].h
                    // console.log(this.currentWeapon.scaleX)

                });
            }

        }



    }
    swithcWeaponUI() {
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
        const currentScaleTo = cc.scaleTo(duration, weaponIconScale[this.nextWeapon.getComponent(cc.Sprite).spriteFrame.name]);
        const nextScaleTo = cc.scaleTo(duration, weaponIconScale[this.currentWeapon.getComponent(cc.Sprite).spriteFrame.name] * 0.8);
        const currentFadeTo = cc.fadeTo(duration, 255);
        const nextFadeTo = cc.fadeTo(duration, 100);

        // 创建回调函数，在动画结束后更新武器状态
        const updateWeaponStatus = cc.callFunc(() => {
            const temp = this.currentWeapon;
            this.currentWeapon = this.nextWeapon;
            this.nextWeapon = temp;
            /* cc.log(this.currentWeapon.getComponent(cc.Sprite).spriteFrame); */
        });

        // 创建顺序动作序列
        const currentSequence = cc.sequence(cc.spawn(currentBezierTo, nextScaleTo, nextFadeTo), updateWeaponStatus);
        const nextSequence = cc.sequence(cc.spawn(nextBezierTo, currentScaleTo, currentFadeTo), cc.callFunc(() => {
            this.canSwitchWeapon = true;
        }));

        this.currentWeapon.runAction(currentSequence);
        this.nextWeapon.runAction(nextSequence);
    }
    onKeyDown(e) {
        /* console.log(e.keyCode) */
        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
    }

}
