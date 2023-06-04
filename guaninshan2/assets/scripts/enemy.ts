// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { weapon } from "./player";
import { knife_valid } from "./hands";

@ccclass
export default class Enemy extends cc.Component {

    @property(cc.Node)
    map: cc.Node = null;

    @property
    text: string = 'hello';

    private life: number;
    private isdead: boolean;
    private mapSize: cc.Size;
    private tileSize: cc.Size;
    private tilemap: cc.TiledMap;
    private being_attacked: boolean;

    onLoad() {
        this.life = 100;
        this.isdead = false;
        this.tilemap = this.map.getComponent(cc.TiledMap);
        this.mapSize = this.tilemap.getMapSize();
        this.tileSize = this.tilemap.getTileSize();
        this.being_attacked = false;
    }

    update(dt) {
        if (this.life <= 0) {
            this.isdead = true;
            this.node.active = false;
            this.scheduleOnce(this.respawnTarget.bind(this), 1);
        }
    }

    respawnTarget() {
        this.node.active = true;
        this.life = 100;
        this.node.setPosition(this.getRandomPosition());
    }

    getRandomPosition() {
        const minX = -this.mapSize.width * this.tileSize.width / 2;
        const minY = -this.mapSize.height * this.tileSize.height / 2;
        const maxX = this.mapSize.width * this.tileSize.width / 2;
        const maxY = this.mapSize.height * this.tileSize.height / 2;

        const x = Math.random() * (maxX - minX);
        const y = Math.random() * (maxY - minY);
        return new cc.Vec2(x, y);
    }

    onCollisionEnter(other, self) {
        console.log("hello knife touch");
        if (other.node.group == 'knife' && weapon == "knife" && knife_valid) {
            console.log("hurts ", this.life);
            this.life -= 10;
        } else if (other.node.group == 'gun' && weapon == 'gun') {
            this.life -= 10;
        }
    }

    onCollisionStay(other, self) {
        if (this.being_attacked = true) return;
        console.log("inside collision stay");
        if (other.node.group == 'knife' && weapon == 'knife' && knife_valid) {
            this.being_attacked = true;
            this.scheduleOnce(() => {
                this.life -= 10;
                this.being_attacked = false;
                console.log("knife attacked");
            }, 0.2)
        }
    }
}
