const { ccclass, property } = cc._decorator;
declare const firebase: any;

@ccclass
export default class Register extends cc.Component {

    @property(cc.Button)
    registerBtn: cc.Button = null;

    @property(cc.Button)
    toLogin: cc.Button = null;

    private playerTs = null;

    start() {
        // init logic
        this.registerBtn.node.on(cc.Node.EventType.TOUCH_END, this.register, this);
        this.toLogin.node.on(cc.Node.EventType.TOUCH_END, () => { cc.director.loadScene("login"); }, this);
    }

    register = async () => {
        let username = cc.find("Canvas/UserName").getComponent(cc.EditBox).string;
        let email = cc.find("Canvas/Email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/Password").getComponent(cc.EditBox).string;
        let repass = cc.find("Canvas/rePassword").getComponent(cc.EditBox).string;
        if (password !== repass) {
            alert("Please check password again!");
        } else {
            try {
                // console.log(username, password);
                const reg = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const db = firebase.database();
                try {
                    const path = db.ref('users/' + reg.user.uid);
                    await path.update({
                        username: username,
                        uid: reg.user.uid,
                        email: email,
                        password: password,
                        score: 0
                    });
                    // console.log("setUserComplete");
                    cc.find("persistnode").getComponent("persistNode").name = username;
                    cc.director.loadScene("Selectstage");
                } catch (er) {
                    console.log(er.message);
                }
            } catch (error) {
                alert(error.message);
            }
        }
    }
}
