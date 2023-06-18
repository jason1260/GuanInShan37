// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const bornPosition = {
    selling: {
        postion1: cc.v2(-387.88, 763.765),
        postion2: cc.v2(-273.542, 763.765)
    },
    errmei: {
        postion1: cc.v2(1138.627, 798.069),
        postion2: cc.v2(1012.84, 798.069)
    },
    tanmen: {
        postion1: cc.v2(473.996, -196.733),
        postion2: cc.v2(335.345, -196.733)
    }
}

const roleName = {
    selling: {
        postion1: "妙覺",
        postion2: "法喜充滿"
    },
    errmei: {
        postion1: "靜虛",
        postion2: "靜玄"
    },
    tanmen: {
        postion1: "唐世政",
        postion2: "唐唐阿宏"
    }
}

const { ccclass, property } = cc._decorator;

export var pathing_Map; //[長][寬] //

@ccclass
export default class GM extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;

    @property(cc.AudioClip)
    knifeSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    gunSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    rifleSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    sniperSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    reloadSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    changeSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    emptySE: cc.AudioClip = null;
    @property(cc.AudioClip)
    stickSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.Prefab)
    AIPrefab: cc.Prefab

    @property(cc.Prefab)
    playerPrefab: cc.Prefab

    playerRole = null;

    bornPosparent = null;

    volume = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        // console.log("123", cc.find("persistnode").getComponent("persistNode"))
        this.playerRole = cc.find("persistnode").getComponent("persistNode").playerRole;
        this.bornPosparent = cc.find("Canvas/Main Camera");
        this.volume = cc.find("persistnode").getComponent("persistNode").volume;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
    }

    start() {
        this.drawColliderboxes();
        this.setBornPos();
        this.playbgm(this.bgm);
        cc.log("?????????????", this.playerRole);
    }

    drawColliderboxes() {
        let tiledSize = this.tiledMap.getTileSize();
        let layers = ['blocks', 'lowBlks', 'secWall', 'secFloor', 'ice', 'mud'];
        let tag = 15;
        let groups = ['wall', 'shortwall', 'secWall', 'secFloor', 'ice', 'mud'];
        let groups_id = 0;

        // 创建二维数组Map，并初始化为0
        let layerSize = this.tiledMap.getMapSize();
        let Map = [];
        for (let i = 0; i < layerSize.width; i++) {
            Map[i] = [];
            for (let j = 0; j < layerSize.height; j++) {
                Map[i][j] = 0;
            }
        }

        for (var layerName of layers) {
            console.log("one", layerName);
            let layer = this.tiledMap.getLayer(layerName);
            if (!layer) { tag++; groups_id++; continue; }
            cc.log(layerName, layer);
            let layerSize = layer.getLayerSize();

            for (let i = 0; i < layerSize.width; i++) {
                for (let j = 0; j < layerSize.height; j++) {
                    let tiled = layer.getTiledTileAt(i, j, true);
                    if (tiled.gid != 0) {
                        tiled.node.group = groups[groups_id];

                        let body = tiled.node.addComponent(cc.RigidBody);
                        body.type = cc.RigidBodyType.Static;
                        let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                        collider.offset = cc.v2(tiledSize.width / 2 - 320, tiledSize.height / 2 - 200);
                        collider.size = tiledSize;
                        collider.tag = tag;
                        collider.friction = 0.2;
                        if (layerName === "secFloor" || layerName === 'ice' || layerName === 'mud') collider.sensor = true;
                        collider.apply();
                        let another = tiled.node.addComponent(cc.BoxCollider);
                        another.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2).add(cc.v2(-320, -200));
                        another.size = tiledSize;

                        // 设置Map对应位置为1z
                        if (layerName == 'secFloor')
                            Map[i][j] = 2;
                        else if (layerName == 'secWall')
                            Map[i][j] = 3;
                        else if (layerName == 'ice' || layerName == 'mud')
                            Map[i][j] = 4;
                        else if (layerName == 'lowBlks')
                            Map[i][j] = 5;
                        else
                            Map[i][j] = 1;
                    }
                }
            }
            tag++;
            groups_id++;
        }

        console.log("Map", Map);
        pathing_Map = Map; // 将Map赋值给类成员变量
        cc.log("pathing_Map", pathing_Map);
    }

    playeffect(handstate) {
        cc.audioEngine.setEffectsVolume(this.volume);
        if (handstate === "knife") {
            cc.audioEngine.playEffect(this.knifeSE, false);
        }
        else if (handstate === "stick") {
            cc.audioEngine.playEffect(this.stickSE, false);
        }
        else if (handstate === "gun") {
            cc.audioEngine.playEffect(this.gunSE, false);
        }
        else if (handstate === "rifle") {
            cc.audioEngine.playEffect(this.rifleSE, false);
        }
        else if (handstate === "sniper") {
            cc.audioEngine.playEffect(this.sniperSE, false);
        }
        else if (handstate === "reload") {
            cc.audioEngine.playEffect(this.reloadSE, false);
        }
        else if (handstate === "changing") {
            cc.audioEngine.playEffect(this.changeSE, false);
        }
        else if (handstate === "empty") {
            cc.audioEngine.playEffect(this.emptySE, false);
        }

    }

    playbgm(bgm) {
        cc.audioEngine.setMusicVolume(this.volume);
        cc.audioEngine.playMusic(bgm, true);
    }
    stopbgm() {
        cc.audioEngine.stopMusic();
    }

    setBornPos() {
        for (let node in this.bornPosparent.children) {

            if (this.bornPosparent.children[node].group == "player")
                this.bornPosparent.children[node].destroy();
        }

        const playerRole = this.playerRole;
        let roles = ["selling", "errmei", "tanmen"];
        let pos = ["postion1", "postion2"];

        // cc.log()

        let setPlayer = false;

        let nameColor = cc.Color.BLUE;


        for (let j = 0; j <= 2; j++) {
            let role = roles[j];
            for (let i = 0; i <= 1; i++) {
                // console.log("???")
                let nameNode = new cc.Node();
                nameNode.addComponent(cc.Label);
                nameNode.name = "name";
                let label = nameNode.getComponent(cc.Label);
                label.string = roleName[roles[j]][pos[i]];
                label.fontSize = 12;
                switch (role) {
                    case "selling":
                        nameNode.color = cc.Color.ORANGE;
                        break;
                    case "errmei":
                        nameNode.color = cc.Color.WHITE;
                    break;
                    case "tanmen":
                        nameNode.color = cc.Color.BLUE;
                    break;
                    default:
                        break;
                }

                if (playerRole == role && !setPlayer) {
                    setPlayer = true;
                    let player = cc.instantiate(this.playerPrefab);
                    cc.log(player.name);
                    let ts = player.getComponent('player') || player.getComponent('AIplayer')
                    player.setPosition(bornPosition[roles[j]][pos[i]]);
                    ts.setRole(role);
                    label.string = "這我";
                    nameNode.rotation = -90;
                    nameNode.setPosition(cc.v2(50, 0));
                    player.addChild(nameNode);
                    this.bornPosparent.insertChild(player, 0);
                    // console.log("player", player);
                }
                else {
                    let AI = cc.instantiate(this.AIPrefab);
                    let ts = AI.getComponent('player') || AI.getComponent('AIplayer')
                    AI.setPosition(bornPosition[roles[j]][pos[i]]);
                    ts.setRole(role);
                    nameNode.rotation = -90;
                    nameNode.setPosition(cc.v2(50, 0));
                    AI.addChild(nameNode);
                    // console.log(AI.children)
                    this.bornPosparent.insertChild(AI, 1);
                    // console.log("AI", AI);
                }
            }
        }

    }

}
