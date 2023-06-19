import Player from "./player";
import { pathing_Map } from "./GM";
import gameInfo = require("./gameInfo");
import Astar from "./astar";

export var AIweapon;

const { ccclass, property } = cc._decorator;

@ccclass
export default class AIPlayer extends Player {

    isDie = false;

    public changeWeaponRadius: number = 150;

    playerList = [];

    attackingList = [];

    attackingTarget: cc.Node = null;

    nearingTarget: cc.Node = null;

    nearstTarget: cc.Node = null;

    sight = 25;

    enemyDistance = null;

    astar = new Astar();

    AIhandsTs = null;

    changeWeaponCD = 0;

    currentangle = null;

    onLoad() {
        this.onIce = false;
        this.onMud = false;
        this.iceCounter = 0;
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
        this.changeWeaponRadius = gameInfo.roleChangeWeaponRadius[this.role]
        this.baseSpeed = gameInfo.roleSpeed[this.role]
        this.nextWeapon = gameInfo.roleNextWeapon[this.role]

        this.astar.setSelf(this.node)
        // this.astar.setTarget();

        this.setPlayerList();
        AIweapon = "knife";
        this.GM = cc.find("Canvas/GM").getComponent('GM') ;
        this.AIhandsTs = this.node.getComponent('AIhands');
    }

    start() {

    }

    update(dt) {
        // console.log(this.bulletNum)
        //update speed
        this.namefix ()
        if (this.isDie){
            this.node.angle = this.currentangle;
            return;
        }

        if (this.HP <= 0) {
            this.isDie = true;
            this.attackingList = [];
            this.attackingTarget = null;
            this.currentangle = this.node.angle;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.AIdie();
            return;
        }

        if (this.Handstate !== 'changing' && this.Handstate !== 'reloading') {
            this.astar.speed = this.baseSpeed - gameInfo.weaponWeight[this.Handstate];
            if (this.onIce) this.astar.speed *= 2;
            if (this.onMud) this.astar.speed *= 0.8;
        }
        //ice counter
        if (this.onIce && this.iceCounter >= 10) {
            this.onIce = false;
            this.iceCounter = -1
        }
        if (this.iceCounter >= 0)
            this.iceCounter++;
        //
        //reload
        if (this.bulletNum <= 0 && this.Handstate !== 'changing' && this.Handstate !== 'reloading')
            this.reload()

        this.astar.setHandState(this.Handstate);

        if (!this.nearingTarget || (this.nearingTarget && this.nearingTarget.name == ''))
            this.findRandomEnemy();

        this.setPlayerList();
        this.findEnemy();
        this.findNearstEnemy();

        if ((this.attackingList.length == 0)) {
            if(this.nearingTarget){
                this.astar.setTarget(this.nearingTarget);
                this.astar.update();
                // cc.log("nearstTarget", this.nearstTarget)
                this.aiming(this.nearingTarget.getPosition());
            }
            // this.findEnemyDest(this.nearstTarget); //找最近敵人
        }

        else {
            if (this.attackingList.length > 0 && this.attackingList[0].target){
                if ((!this.attackingTarget || (this.attackingTarget && this.attackingTarget.name == "")))
                    this.attackingTarget = this.attackingList[0].target;
                this.astar.setTarget(this.attackingTarget);
                this.astar.update();
                this.aiming(this.attackingTarget.getPosition()); //滑鼠移到目標並rotate
            }
            // this.findEnemyDest(this.attackingTarget);
        }


        if (this.attackingTarget && this.attackingTarget.name != '')
            this.enemyDistance = cc.Vec2.distance(this.node.getPosition(), this.attackingTarget.getPosition());

        this.changeWeaponCD += dt;
        if (this.changeWeaponCD >= 0.5) {
            this.changeWeaponCD = 0;
            if (this.enemyDistance < this.changeWeaponRadius && gameInfo.rangedWeapon.includes(this.Handstate)) {
                this.changeWeapon();
            }
            else if (this.enemyDistance > this.changeWeaponRadius && gameInfo.nearWeapon.includes(this.Handstate) && this.AIhandsTs.Canshoot) {
                this.changeWeapon();
            }
            else if (gameInfo.rangedWeapon.includes(this.Handstate) && !this.AIhandsTs.Canshoot) {
                this.changeWeapon();
            }
        }

        if (this.Handstate !== 'changing' && this.Handstate !== 'reloading')
            this.speed = this.baseSpeed - gameInfo.weaponWeight[this.Handstate];
    }

    AIdie() {
        // 创建淡出动画
        let fadeOut = cc.fadeOut(0.5);
        // 创建动画完成后的回调函数
        let callback = cc.callFunc(() => {
            this.node.destroy();
        });
        // 创建动作序列，先淡出再执行回调函数销毁节点
        let sequence = cc.sequence(fadeOut, callback);

        this.node.stopAllActions();
        // 运行动作序列
        this.node.runAction(sequence);
    }

    setPlayerList() {
        this.playerList = cc.find("Canvas/Main Camera").children;
        this.playerList = this.playerList.filter((child) => child.group == "player")
        /* console.log(this.playerList) */
        // cc.find("Canvas/Main Camera/players/player")
    }


    findEnemy() {
        //使用pathing_Map檢測有敵人可否攻擊
        // 將看到的敵人都加入attacking
        let startplace = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
    
        let playerMapPos = [Math.floor(startplace.x / 48), Math.floor(startplace.y / 48)];
        this.attackingList = this.attackingList.filter((element) => element.name == "")
        this.playerList.forEach(target => {
            if (target.name == '' || (this.attackingList.length > 0 && this.attackingList.includes(target)))
                return;
            let ts = target.getComponent('player') || target.getComponent('AIplayer')
            if (target == this.node || ts.role == this.role) return;
            let endplace = target.convertToWorldSpaceAR(new cc.Vec2(0, 0));
            let targetMapPos = [Math.floor(endplace.x / 48), Math.floor(endplace.y / 48)];
    
            let [startX, startY] = playerMapPos;
            let [endX, endY] = targetMapPos;
            let dx = endX - startX;
            let dy = endY - startY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let findTarget = true;
    
            if (this.sight > distance) {
                let path = [];
                for (let i = 1; i < distance; i++) {
                    const x = Math.round(startX + (dx * i) / distance);
                    const y = Math.round(startY + (dy * i) / distance);
                    if (pathing_Map[x][24 - y] == 1) {
                        findTarget = false;
                    }
                    path.push([x, y]);
                }
                if (findTarget)
                    this.attackingList.push({ target, distance }); // Include distance in the attackingList
            }
        });
        // Sort attackingList based on distance in ascending order
        this.attackingList.sort((a, b) => a.distance - b.distance);
    }
    reload() {
        this.tmpWeapon = this.Handstate;
        this.Handstate = 'reloading';
        this.scheduleOnce(() => {
            this.Handstate = this.tmpWeapon;
            // console.log(this.Handstate)
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate];
            // console.log("哈哈",this.bulletNum)
        }, 1)

    }

    findNearstEnemy() {
        //從playerlist開始找
        let nearstEnemy = null;
        let nearstDistance = 1000000;
        this.playerList.forEach(playerNode => {
            // cc.log("player", playerNode)
            if (playerNode.name == '')
                return;
            let ts = playerNode.getComponent('player') || playerNode.getComponent('AIplayer')
            if (playerNode != this.node && this.role != ts.role) {
                let distance = cc.Vec2.distance(this.node.getPosition(), playerNode.getPosition());
                if (nearstDistance > distance) {
                    nearstDistance = distance;
                    nearstEnemy = playerNode;
                }
            }
        });
        this.nearstTarget = nearstEnemy;
    }

    findRandomEnemy() {
        //從playerlist開始找
        let nearstEnemy = null;
        let nearstDistance = 1000000;
        let filtered = []
        this.playerList.forEach(playerNode => {
            // cc.log("player", playerNode)
            if (playerNode.name == '')
                return;
            let ts = playerNode.getComponent('player') || playerNode.getComponent('AIplayer')
            if (playerNode != this.node && this.role != ts.role) {
                filtered.push(playerNode)
                let distance = cc.Vec2.distance(this.node.getPosition(), playerNode.getPosition());
                if (nearstDistance > distance) {
                    nearstDistance = distance;
                    nearstEnemy = playerNode;
                }
            }
        });
        let random1 = Math.random();

        if (random1 >= 0.6)
            this.nearingTarget = nearstEnemy;
        else 
            this.nearingTarget = filtered[Math.floor(Math.random()*filtered.length)];
    }

    aiming(targetPos) {
        let mousePos = targetPos;
        let playerPos = this.node.getPosition()
        let direction = mousePos.sub(playerPos);
        // console.log(direction.x)
        if (direction.x == 0 && direction.y == 0 && direction.z == 0) return;
        let angle = cc.v2(1, 0).signAngle(direction);
        let degree = cc.misc.radiansToDegrees(angle);
        this.dirAngle = degree;
        this.node.angle = degree;
    }
    changeWeapon() {
        this.deleteWeapon();
        this.tmpWeapon = this.nextWeapon;
        this.nextWeapon = this.Handstate;
        this.Handstate = 'changing'
        this.scheduleOnce(() => {
            this.Handstate = this.tmpWeapon;
            this.addWeapon();
            this.bulletNum = gameInfo.weaponbulletNum[this.Handstate]
        }, 1)

    }
    onCollisionExit(otherCollider, selfCollider) {
        // console.log(otherCollider.node.group)
        if (otherCollider.node.group == 'ice') {
            this.iceCounter = 0;
        } else if (otherCollider.node.group == 'mud') this.onMud = false;
    }

    onCollisionStay(otherCollider, selfCollider) {
        if (otherCollider.node.group == 'ice') {
            this.iceCounter = -1;
            this.onIce = true;
        } else if (otherCollider.node.group == 'mud') this.onMud = true;
    }
}