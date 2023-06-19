// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
declare const firebase: any;
const bornPosition = {
    selling: {
        postion1: cc.v2(0, 0),
        postion2: cc.v2(30, 0)
    },
    errmei: {
        postion1: cc.v2(10, 0),
        postion2: cc.v2(40, 0)
    },
    tanmen: {
        postion1: cc.v2(20, 0),
        postion2: cc.v2(50, 0)
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
export default class GMBoss extends cc.Component {

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

    @property(cc.Prefab)
    Map1Prefab: cc.Prefab

    @property(cc.Prefab)
    Map2Prefab: cc.Prefab

    @property(cc.Prefab)
    IcePrefab: cc.Prefab

    @property(cc.Prefab)
    MudPrefab: cc.Prefab

    @property(cc.Prefab)
    AIPrefab: cc.Prefab

    @property(cc.Prefab)
    playerPrefab: cc.Prefab

    playerRole = null;

    bornPosparent = null;
    volume = null;
    currMapPos = null;

    Mapgroup = null;

    mapParent = null;

    playerList = null;
    public roomListener  = null;
    public roomData = null;
    public room = null;
    public mulRole = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.room = cc.find("persistnode").getComponent("persistNode").room;
        this.mulRole = cc.find("persistnode").getComponent("persistNode").mulRole


        this.roomListener  = firebase.database().ref('rooms/' + this.room).on('value', (snapshot) => {
            const roomData = snapshot.val();
            this.roomData = snapshot.val()
           
            
        });





        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        // console.log("123", cc.find("persistnode").getComponent("persistNode"))
        this.playerRole = cc.find("persistnode").getComponent("persistNode").playerRole;
        this.bornPosparent = cc.find("Canvas/Main Camera");
        this.volume = cc.find("persistnode").getComponent("persistNode").volume;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        this.mapParent = cc.find("Canvas/scene2");
        this.currMapPos = cc.v2(0, 0);
    }
    onDestroy() {
        firebase.database().ref('rooms/' + this.room).off('value', this.roomListener);
    }
    start() {
        
        this.setBornPos();
        this.setMap();
        cc.log("?????????????", this.playerRole)
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
                // console.log("playerRole", playerRole);
                // console.log("role", role);
                // console.log("setPlayer", setPlayer);
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
                    /* let AI = cc.instantiate(this.AIPrefab);
                    let ts = AI.getComponent('player') || AI.getComponent('AIplayer')
                    AI.setPosition(bornPosition[roles[j]][pos[i]]);
                    ts.setRole(role);
                    this.bornPosparent.insertChild(AI, 1); */
                    // console.log("AI", AI);
                }
            }
        }

    }

    setMap() {
        let mapcenter = null;
        console.log("start pos", this.bornPosparent.getPosition());

        for (let i = 9; i >= 1; i -= 1) {
            let Sample = Math.random();
            if (i == 5) mapcenter = cc.instantiate(this.Map1Prefab);
            else {
                if (Sample < 0.25) mapcenter = cc.instantiate(this.Map1Prefab);
                else if (Sample < 0.5) mapcenter = cc.instantiate(this.Map2Prefab);
                else if (Sample < 0.75) mapcenter = cc.instantiate(this.IcePrefab);
                else mapcenter = cc.instantiate(this.MudPrefab);
            }
            let xpos = 0, ypos = 0;
            if (i == 1 || i == 4 || i == 7) xpos = -960;
            else if (i == 2 || i == 5 || i == 8) xpos = 0;
            else xpos = 960;

            if (i <= 3) ypos = 640;
            else if (i <= 6) ypos = 0;
            else ypos = -640;
            mapcenter.setPosition(cc.v2(xpos, ypos));
            this.mapParent.insertChild(mapcenter, 0);
            console.log("this is map", i, Sample);
        }
    }

    update() {


        this.playerList = cc.find("Canvas/Main Camera").children;
        this.playerList = this.playerList.filter((child) => child.group == "boss");
        let nonplayerList = this.playerList;
        console.log(nonplayerList.length);
        if(nonplayerList.length == 0){
            this.win();
        }
        if(this.roomData.A.die || this.roomData.B.die)
            this.leave()
       

       
    }
    leave(){
        if(this.mulRole == 'A'){
            firebase.database().ref('/rooms/' + this.room).remove()
            .then(() => {
                console.log('房间删除成功');
                this.lose();
            })
            .catch((error) => {
                console.log('删除节点时出错：', error);
                this.lose();
            });
        
        }else{
            this.lose();
        }
        
    }
    win(){
        console.log("win");
        cc.find("persistnode").getComponent("persistNode").win = true;
        cc.delayTime(1);
        cc.director.loadScene("Win");
        
    }
    lose(){
        console.log("lose");
        cc.find("persistnode").getComponent("persistNode").win = false;
        cc.delayTime(1);
        cc.director.loadScene("Win");
    }
    randDrop() {
        let weapon= ['gun', 'rifle', 'sniper','knife','stick'];
        const randomIndex = Math.floor(Math.random() * weapon.length);
        let weaponType = weapon[randomIndex];  

        cc.resources.load(`Prefab/${weaponType}Drop`, cc.Prefab, (err, prefab) => {
            if (err) {
                console.log("沒辦法大便");
                return;
            }
            let player =cc.find("Canvas/Main Camera/player")
            const newNode = cc.instantiate(prefab);
            newNode.position = player.getPosition().add(player.parent.getPosition());
            const sample1 = Math.random(), sample2 = Math.random();
            const radius = 200;
            newNode.position = newNode.position.add(cc.v2((radius * sample1) -100, (radius * sample2) -100));
            const nodeIndex = player.parent.getSiblingIndex();
            this.node.parent.parent.insertChild(newNode, nodeIndex);
        });

    }

}
