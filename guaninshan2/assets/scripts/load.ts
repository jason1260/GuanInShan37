// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class load extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:
    scene_string = "";

    onLoad () {
        this.scene_string = "";
        if(cc.find("persistnode").getComponent("persistNode").selectStage == 1){
            this.scene_string = "test";
            console.log("test");
        }else if(cc.find("persistnode").getComponent("persistNode").selectStage == 2){
            this.scene_string = "IceAndFire";
            console.log("IceAndFire");
        }else if(cc.find("persistnode").getComponent("persistNode").selectStage == 3){
            this.scene_string = "boss";
            console.log("boss");
        }
        cc.director.preloadScene(this.scene_string, function () {
            cc.log("Next scene preloaded");
        });
    }

    start () {
        this.scheduleOnce(function() {
            cc.director.loadScene(this.scene_string);
        }, 3);
    }

    // update (dt) {}
}
