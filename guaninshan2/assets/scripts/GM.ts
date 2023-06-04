// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
    }

    start () {
        this.drawColliderboxes();
    }

    drawColliderboxes (){
        let tiledSize = this.tiledMap.getTileSize();
        let layers = ['blocks'];
        let tag = 15;
        for (var layerName of layers) {
            let layer = this.tiledMap.getLayer(layerName);
            cc.log(layerName, layer);
            let layerSize = layer.getLayerSize();

            for (let i = 0; i < layerSize.width; i++) {
                for (let j = 0; j < layerSize.height; j++) {
                    let tiled = layer.getTiledTileAt(i, j, true);
                    if (tiled.gid != 0) {
                        tiled.node.group = 'wall';

                        let body = tiled.node.addComponent(cc.RigidBody);
                        body.type = cc.RigidBodyType.Static;
                        let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                        collider.offset = cc.v2(tiledSize.width/2 - 320, tiledSize.height/2 -200);
                        collider.size = tiledSize;
                        collider.tag = tag;
                        collider.friction = 0.2;
                        collider.apply();
                    }
                }
            }
            tag++;
        }
    }

}
