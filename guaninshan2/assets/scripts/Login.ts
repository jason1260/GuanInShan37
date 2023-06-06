const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class Login extends cc.Component {


    
    start () {
        // init logic
        this.InitLogin();
    }

    InitLogin(){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Login";
        clickEventHandler.handler = "login";
        cc.find("Canvas/menu_bg/Login").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    login(){
        // let email = cc.find("Canvas/menu_bg/block/Email").getComponent(cc.EditBox).string;
        // let password = cc.find("Canvas/menu_bg/block/Password").getComponent(cc.EditBox).string;
        // firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        //     alert("Login Success");
        //     cc.director.loadScene("GameStart");
        // }).catch(function(error) {
        //     // Handle Errors here.
        //     alert(error.message);
        //     // console.log(error);
        // });
        cc.director.loadScene("test");
    }
}
