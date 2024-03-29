// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import gameInfo = require("./gameInfo");
const { ccclass, property } = cc._decorator;

@ccclass
export default class Cursor extends cc.Component {

    player: cc.Node = null;

    public playerTs = null;

    onLoad() {
        cc.game.canvas.style.cursor = 'none';

    }
    onDestroy() {
        cc.game.canvas.style.cursor = 'default';
    }
    start() {

    }

    update() {
        if (!this.player) {
            this.player = cc.find("Canvas/Main Camera/player")
            if (!this.player) return
            this.playerTs = this.player.getComponent('player');
            cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
            this.createCursor();
        }
        const cursorNode = this.node.getChildByName("Cursor");
        const graphics = cursorNode.getComponent(cc.Graphics);
        if (this.playerTs.bulletNum <= 0) {
            graphics.clear()
            const lineWidth = 3;
            const color = cc.Color.RED;

            // 绘制叉叉
            const size = this.playerTs.shootRadius;
            const halfSize = size * 0.5;
            graphics.moveTo(-halfSize, -halfSize);
            graphics.lineTo(halfSize, halfSize);
            graphics.strokeColor = color;
            graphics.lineWidth = lineWidth;
            graphics.moveTo(-halfSize, halfSize);
            graphics.lineTo(halfSize, -halfSize);
            graphics.circle(0, 0, this.playerTs.shootRadius);
            graphics.lineWidth = 3;
            graphics.strokeColor = cc.Color.RED;
            graphics.stroke();
            return;
        }
        if (gameInfo.rangedWeapon.includes(this.playerTs.Handstate)) {
            graphics.clear()
            graphics.circle(0, 0, this.playerTs.shootRadius);
            graphics.lineWidth = 3;
            graphics.strokeColor = cc.Color.WHITE;
            graphics.stroke();
        } else {
            graphics.clear()
            graphics.circle(0, 0, 1);
            graphics.lineWidth = 10;
            graphics.strokeColor = cc.Color.WHITE;
            graphics.stroke();
        }

    }
    /** 比較好的極座標隨機取點函式 */
    createCursor() {
        // 创建空心圆圈精灵节点
        // console.log('create')
        const cursorNode = new cc.Node();
        cursorNode.name = "Cursor"; // 设置节点名称
        cursorNode.zIndex = cc.macro.MAX_ZINDEX; // 设置节点名称
        const graphics = cursorNode.addComponent(cc.Graphics);

        // 设置空心圆圈的半径和线条颜色
        const radius = this.playerTs.shootRadius;
        const lineWidth = 3;
        const color = cc.Color.WHITE;

        // 绘制空心圆圈
        graphics.circle(0, 0, radius);
        graphics.lineWidth = lineWidth;
        graphics.strokeColor = color;
        graphics.stroke();

        // 创建实心白色点
        const dotNode = new cc.Node();
        dotNode.name = "Dot"; // 设置节点名称
        const dotGraphics = dotNode.addComponent(cc.Graphics);
        const dotRadius = 3;
        const dotColor = cc.Color.WHITE;
        dotGraphics.circle(0, 0, dotRadius);
        dotGraphics.fillColor = dotColor;
        dotGraphics.fill();
        cursorNode.addChild(dotNode);

        // 将空心圆圈添加到Canvas节点下，并设置初始位置与鼠标位置一致
        this.node.addChild(cursorNode);


    }



    onMouseMove(event: cc.Event.EventMouse) {
        // 更新空心圆圈的位置与鼠标位置一致
        const cursorNode = this.node.getChildByName("Cursor");
        const mousePos = event.getLocation();
        const camera = cc.find("Canvas/Main Camera")
        // 将鼠标坐标转换为玩家节点的本地坐标系
        const playerLocalPos = this.node.parent.convertToNodeSpaceAR(mousePos).add(camera.getPosition());

        // 在玩家节点的本地坐标系中操作

        cursorNode.setPosition(playerLocalPos);
    }
}
