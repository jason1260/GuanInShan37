// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../player";

const {ccclass, property} = cc._decorator;
const Input = {}
import gameInfo = require("../gameInfo");
@ccclass
export default class PlayerBoss extends Player {

    bossPos = cc.v2(0, 0);

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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



        for (var member in Input)  Input[member] = 0;
        this.score = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);


        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
        this.onMud = false;
        this.GM = cc.find("Canvas/GM").getComponent('GM_boss');
    }

    start () {

    }

    update (dt) {
        super.update(dt);
        this.bossPos = cc.find("Canvas/Main Camera/blue-boss1").getPosition();
        this.showbossPosNotice();
    }

    showbossPosNotice() {
        const playerPos = this.node.getPosition();
        const bossDir = this.bossPos.sub(playerPos).normalize();
    
        let cameraEdgeDis = bossDir.mul(200);
        let cameraEdgePos = cameraEdgeDis.add(playerPos);
    
        const distanceToCameraEdge = cc.Vec2.distance(playerPos, this.bossPos);
        const threshold = 500; // 调整此阈值以控制头像出现的距离阈值
        // console.log(distanceToCameraEdge)
        if (distanceToCameraEdge >= threshold) {
            // 在连线上显示 Boss 头像
            let graphicsNode = cc.find("Canvas/Main Camera/graphicsNode");
            if (!graphicsNode) {
                let headIconNode = new cc.Node();
                let graphicsNode = new cc.Node();
                let graphics = graphicsNode.addComponent(cc.Graphics);
                let headIconSprite = headIconNode.addComponent(cc.Sprite);
                headIconNode.name = "headIcon";
                graphicsNode.name = "graphicsNode";
                cc.resources.load("blue-boss-idle", cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        console.error("加载 Boss 头像预制资源失败：", err);
                        return;
                    }
                    headIconSprite.spriteFrame = spriteFrame;


                    let Node = cc.find("Canvas/Main Camera/graphicsNode");
                    if (Node) {
                        // headIcon.removeFromParent();
                        Node.destroy();
                    
                    }
                    graphicsNode.addChild(headIconNode);
                    graphicsNode.setPosition(cameraEdgePos);
                    graphics.circle(0, 0, 30);
                    graphics.fillColor = cc.Color.WHITE;
                    graphics.fill();
                    
                    // 绘制绿色边框
                    graphics.circle(0, 0, 28);
                    graphics.lineWidth = 5;
                    graphics.strokeColor = cc.Color.RED;
                    graphics.stroke();
                    
                    
                    cc.find("Canvas/Main Camera").addChild(graphicsNode);
                });
            } 
            
            else {
                graphicsNode.setPosition(cameraEdgePos);
            }
        } 
        else {
            // 隐藏 Boss 头像
            const graphicsNode = cc.find("Canvas/Main Camera/graphicsNode");
            if (graphicsNode) {
                // headIcon.removeFromParent();
                graphicsNode.destroy();
            }
        }
    }
}
