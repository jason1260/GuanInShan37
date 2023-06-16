import Player from "./player";
import { pathing_Map } from "./GM";
import gameInfo = require("./gameInfo");
import Astar from "./astar";

export var AIweapon;

const {ccclass, property} = cc._decorator;

@ccclass
export default class AIPlayer extends Player {

    @property()
    changeWeaponRadius: number = 150;

    playerList = [];

    attackingList = [];

    attackingTarget: cc.Node = null;

    nearstTarget: cc.Node = null;

    sight = 25;

    enemyDistance = null;

    astar = new Astar();

    AIhandsTs = null;

    onLoad () {
        this.astar.setSelf(this.node)
        // this.astar.setTarget();

        this.setPlayerList();
        AIweapon = "knife";
        this.GM = cc.find("Canvas/GM").getComponent('GM');
        this.AIhandsTs = this.node.getComponent('AIhands');
    }

    start () {

    }

    update (dt) {
        // cc.log(this.attackingTarget)
        console.log()
        if (this.HP <= 0)
            this.node.destroy();
        this.astar.setHandState(this.Handstate);
        if(!this.attackingTarget){
            this.setPlayerList();
            this.findEnemy();
            this.attackingTarget = this.attackingList[this.attackingList.length-1];
        }
        if(this.attackingTarget && this.attackingTarget.name == ''){
            this.setPlayerList();
            this.findEnemy();
            this.attackingTarget = this.attackingList[this.attackingList.length-1];
        }

        // cc.log(this.attackingList)

        if (this.attackingList.length == 0) {
            this.findNearstEnemy(); 
            this.astar.setTarget(this.nearstTarget);
            this.astar.update();
            // cc.log("nearstTarget", this.nearstTarget)
            this.aiming(this.nearstTarget.getPosition());
            // this.findEnemyDest(this.nearstTarget); //找最近敵人
        }
        else {
            this.astar.setTarget(this.attackingTarget);
            this.astar.update();
            this.aiming(this.attackingTarget.getPosition()); //滑鼠移到目標並rotate
            // this.findEnemyDest(this.attackingTarget);
        }



        if (this.attackingTarget && this.attackingTarget.name != '') 
            this.enemyDistance = cc.Vec2.distance(this.node.getPosition(), this.attackingTarget.getPosition());
        
        if (this.enemyDistance < this.changeWeaponRadius && gameInfo.rangedWeapon.includes(this.Handstate)) {
            this.changeWeapon();
        }
        else if (this.enemyDistance > this.changeWeaponRadius && gameInfo.nearWeapon.includes(this.Handstate)) {
            this.changeWeapon();
        }

        if (this.Handstate !== 'changing' && this.Handstate !== 'reloading')
            this.speed = this.baseSpeed - gameInfo.weaponWeight[this.Handstate];
    }

    setPlayerList() {
        this.playerList = cc.find("Canvas/Main Camera").children;
        this.playerList=this.playerList.filter((child)=>child.group == "player")
        /* console.log(this.playerList) */
        // cc.find("Canvas/Main Camera/players/player")
    }


    findEnemy() { 
        //使用pathing_Map檢測有敵人可否攻擊
        // 將看到的敵人都加入attacking
        let startplace = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));

        let playerMapPos = [Math.floor(startplace.x / 48),Math.floor(startplace.y / 48)];
        this.attackingList = []
        this.playerList.forEach(target => {
            if (target == this.node) return;
            let endplace = target.convertToWorldSpaceAR(new cc.Vec2(0, 0));
            let targetMapPos = [Math.floor(endplace.x / 48), Math.floor(endplace.y / 48)];

            let [startX, startY] = playerMapPos;
            let [endX, endY] = targetMapPos;
            let dx = endX - startX;
            let dy = endY - startY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let findTarget = true;

            // cc.log(this.sight, distance)
            // cc.log(startX, startY, endX, endY)
            // cc.log(startX, dx, distance, Math.round(startX + (dx * 2) / distance))
            if (this.sight > distance) {
                let path = [];
                for (let i = 1; i < distance; i++) {
                    const x = Math.round(startX + (dx * i) / distance);
                    const y = Math.round(startY + (dy * i) / distance);
                    // cc.log(x, y)
                    if (pathing_Map[x][24-y] == 1) {
                        findTarget = false;
                    }
                    path.push([x, y])
                }

                // cc.log(startX, startY, endX, endY, path)
                
                let existed = false;

                if(!existed && findTarget)
                    this.attackingList.push(target);
            }
        });
    }

    findNearstEnemy() {
        //從playerlist開始找
        let nearstEnemy = null;
        let nearstDistance = 1000000;
        // cc.log(this.playerList)
        this.playerList.forEach(playerNode => {
            // cc.log("player", playerNode)
            if(playerNode != this.node){
                let distance = cc.Vec2.distance(this.node.getPosition(), playerNode.getPosition());
                if (nearstDistance > distance) {
                    nearstDistance = distance;
                    nearstEnemy = playerNode;
                }
            }
        });
        this.nearstTarget = nearstEnemy;
    }

    aiming(targetPos){
        let mousePos = targetPos;
        let playerPos = this.node.getPosition()
        let direction = mousePos.sub(playerPos);
        // console.log(direction.x)
        if(direction.x == 0 &&  direction.y == 0 && direction.z == 0 ) return;
        let angle = cc.v2(1, 0).signAngle(direction);
        let degree = cc.misc.radiansToDegrees(angle);
        this.dirAngle = degree;
        this.node.angle = degree;
    }

    onCollisionStay(otherCollider, selfCollider) {

    }
}