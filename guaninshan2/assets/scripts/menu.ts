const {ccclass, property} = cc._decorator;

declare const firebase: any;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {cc.director.loadScene("login");}, this);
        // cc.find("persistnode").getComponent("persistNode").volume = 0.5;
    }

    start () {
        // init logic
        // this.startGame();
        let action = cc.repeatForever(cc.sequence(cc.fadeOut(1), cc.fadeIn(1)));
        cc.find("Canvas/menu_bg/Press").runAction(action);
    }

    update (dt) {
        
    }

    startGame(){
        // let clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = this.node;
        // clickEventHandler.component = "menu";
        // clickEventHandler.handler = "hellowworld";

        // firebase.auth().onAuthStateChanged((user) => {
        //     if (user) {
        //       // User is signed in.
        //       console.log("user is signed in");
        //       cc.director.loadScene("SelectStage");
        //     } else {
        //       // No user is signed in.
        //       console.log("no user is signed in");
        //       cc.director.loadScene("Auth");
        //     }
        // });
        cc.director.loadScene("login");
        // cc.find("Canvas/StartButton").getComponent(cc.Button).clickEvents.push(clickEventHandler);
        // cc.director.loadScene("GameStart");
    }

    onKeyDown(event){
        if(event.keyCode === cc.macro.KEY.enter){
            this.startGame();
        }
    }
    onKeyUp(event){
    }
}
