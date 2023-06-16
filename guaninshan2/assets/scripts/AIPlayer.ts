import Player from "./player";
import { pathing_Map } from "./GM";
import gameInfo = require("./gameInfo");
import Astar from "./astar";

export var AIweapon;

const {ccclass, property} = cc._decorator;

@ccclass
export default class AIPlayer extends Player {

    @property()
    AstarDestRadius: number = 4;

    @property()
    changeWeaponRadius: number = 200;

    playerList = [];

    attackingList = [];

    attackingTarget: cc.Node = null;

    nearstTarget: cc.Node = null;

    sight = 25;

    enemyDistance = null;

    astar = new Astar();

    onLoad () {
        this.astar.setSelf(this.node)
        // this.astar.setTarget();
        this.playerList = [cc.find("Canvas/Main Camera/player")];
        AIweapon = "knife";
        this.GM = cc.find("Canvas/GM").getComponent('GM');
    }

    start () {

    }

    update (dt) {
        // cc.log(this.attackingTarget)
        this.findEnemy();

        if (this.attackingList === null) {
            this.findNearstEnemy(); 
            this.astar.setTarget(this.nearstTarget);
            this.astar.update();
            // this.findEnemyDest(this.nearstTarget); //找最近敵人
        }

        else {
            this.attackingTarget = this.attackingList[0];
            this.astar.setTarget(this.attackingTarget);
            this.astar.update();
            // this.findEnemyDest(this.attackingTarget);
        }

        if (this.attackingTarget != null) {
            this.aiming(this.attackingTarget.getPosition()); //滑鼠移到目標並rotate
        }

        if (this.attackingTarget != null) 
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

    findEnemy() { 
        //使用pathing_Map檢測有敵人可否攻擊
        // 將看到的敵人都加入attacking
        let startplace = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));

        let playerMapPos = [Math.floor(startplace.x / 48),Math.floor(startplace.y / 48)];

        this.playerList.forEach(target => {
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
                this.attackingList.forEach(element => {
                    if (target === element)
                        existed = true;
                });
                if(!existed && findTarget)
                    this.attackingList.push(target);
            }
        });

    }

    findNearstEnemy() {
        //從playerlist開始找
        let nearstEnemy = null;
        let nearstDistance = 1000000;
        this.playerList.forEach(playerNode => {
            let distance = cc.Vec2.distance(this.node.getPosition(), playerNode.getPosition());
            if (nearstDistance > distance) {
                nearstDistance = distance;
                nearstEnemy = playerNode;
            }
        });
        this.nearstTarget = nearstEnemy;
    }

    aiming(targetPos){
        let mousePos = targetPos;
        let playerPos = this.node.getPosition()
        let direction = mousePos.sub(playerPos);
        let angle = cc.v2(1, 0).signAngle(direction);
        let degree = cc.misc.radiansToDegrees(angle);
        this.dirAngle = degree;
        this.node.angle = degree;
    }
}
