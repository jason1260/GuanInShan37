// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../player";
import { notstart } from "./GM_boss";

const { ccclass, property } = cc._decorator;
const Input = {}
import gameInfo = require("../gameInfo");
@ccclass
export default class PlayerBoss extends Player {

    bossPos = cc.v2(0, 0);

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
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



        for (var member in Input) Input[member] = 0;
        this.score = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);


        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        cc.find("Canvas/scene2/bg").on(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this)
        this.onMud = false;
        this.GM = cc.find("Canvas/GM").getComponent('GM_boss');
    }

    start() {

    }

    update(dt) {
        if (notstart) return;
        super.update(dt);
        this.bossPos = cc.find("Canvas/Main Camera/blue-boss1").getPosition();
        this.showbossPosNotice();
    }

    showbossPosNotice() {
        const playerPos = this.node.getPosition();
        const bossDir = this.bossPos.sub(playerPos).normalize();

        const cameraEdgeDis = bossDir.mul(200);
        const cameraEdgePos = cameraEdgeDis.add(playerPos);

        const distanceToCameraEdge = cc.Vec2.distance(playerPos, this.bossPos);
        const threshold = 500; // Adjust this threshold to control the distance threshold at which the boss icon appears

        if (distanceToCameraEdge >= threshold) {
            let graphicsNode = cc.find("Canvas/Main Camera/graphicsNode");
            if (!graphicsNode) {
                let headIconNode = new cc.Node();
                let graphicsNode = new cc.Node();
                let graphics = graphicsNode.addComponent(cc.Graphics);
                let headIconSprite = headIconNode.addComponent(cc.Sprite);
                let triangleNode = new cc.Node(); // Create a new node for the triangle
                let triangleGraphics = triangleNode.addComponent(cc.Graphics); // Add a Graphics component to the triangle node
                headIconNode.name = "headIcon";
                graphicsNode.name = "graphicsNode";

                cc.resources.load("blue-boss-idle", cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        console.error("Failed to load boss icon resource:", err);
                        return;
                    }
                    headIconSprite.spriteFrame = spriteFrame;

                    let Node = cc.find("Canvas/Main Camera/graphicsNode");
                    if (Node) {
                        Node.destroy();
                    }

                    // graphicsNode.addChild(triangleNode);
                    graphicsNode.addChild(headIconNode);
                    graphicsNode.setPosition(cameraEdgePos);
                    graphics.circle(0, 0, 30);
                    graphics.fillColor = cc.Color.WHITE;
                    graphics.fill();

                    // Draw the red border
                    graphics.circle(0, 0, 28);
                    graphics.lineWidth = 5;
                    graphics.strokeColor = cc.Color.RED;
                    graphics.stroke();

                    // Calculate the position of the triangle
                    const triangleSize = 5;
                    const trianglePos = bossDir.mul(45 + triangleSize);
                    let triangleRotation = Math.atan2(bossDir.y, bossDir.x);
                    triangleGraphics.moveTo(-triangleSize, 0);
                    triangleGraphics.lineTo(triangleSize, 0);
                    triangleGraphics.lineTo(0, triangleSize);
                    triangleGraphics.close();
                    triangleGraphics.fillColor = cc.Color.RED;
                    triangleGraphics.strokeColor = cc.Color.RED;
                    triangleGraphics.stroke();
                    triangleGraphics.fill();
                    triangleNode.setPosition(trianglePos);
                    triangleNode.angle = cc.misc.radiansToDegrees(triangleRotation);
                    triangleNode.name = "triangleNode"

                    cc.find("Canvas/Main Camera").addChild(graphicsNode);
                });
            } else {
                graphicsNode.setPosition(cameraEdgePos);
                const triangleNode = graphicsNode.getChildByName("triangleNode");
                if (triangleNode) {
                    const triangleRotation = Math.atan2(bossDir.y, bossDir.x);
                    triangleNode.angle = cc.misc.radiansToDegrees(triangleRotation);
                }
            }
        } else {
            const graphicsNode = cc.find("Canvas/Main Camera/graphicsNode");
            if (graphicsNode) {
                graphicsNode.destroy();
            }
        }
    }
}
