import Player from "./player";
import { pathing_Map } from "./GM";
import gameInfo = require("./gameInfo");

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

    sight = 12;

    enemyDistance = null;

    onLoad () {
        this.playerList = [cc.find("Canvas/Main Camera/player")];
        AIweapon = "knife";
        this.GM = cc.find("Canvas/GM").getComponent('GM');
    }

    start () {

    }

    update (dt) {
        if(this.HP <= 0)
            this.node.destroy();
        this.findEnemy();
        if (this.attackingList === null) {
            this.findNearstEnemy(); 
            this.findEnemyDest(this.attackingTarget); //找最近敵人
        }

        else {
            this.attackingTarget = this.attackingList[0];
            this.findEnemyDest(this.attackingTarget);
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

    findEnemyDest (attackingTarget: cc.Node) {
        
    }

    findEnemy() { 
        //使用pathing_Map檢測有敵人可否攻擊
        // 將看到的敵人都加入attacking
        let playerMapPos = [Math.floor((this.node.getPosition().x+480)/48), Math.floor((this.node.getPosition().y+320)/48)];

        this.playerList.forEach(target => {
            let targetMapPos = [Math.floor((target.getPosition().x+480)/48), Math.floor((target.getPosition().y+320)/48)];

            const [startX, startY] = playerMapPos;
            const [endX, endY] = targetMapPos;
            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            let findTarget = true;

            if (this.sight < distance) return;

            let path = [];

            for (let i = 1; i < distance; i++) {
                const x = Math.round(startX + (dx * i) / distance);
                const y = Math.round(startY + (dy * i) / distance);
                if (pathing_Map[x][y] == 1) {
                    findTarget = false;
                }
                path.push([x, y])
            }

      

            let existed = false;
            this.attackingList.forEach(element => {
                if (target === element)
                    existed = true;
            });
            if(!existed && findTarget)
                this.attackingList.push(target);
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
        this.attackingTarget = nearstEnemy;
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
