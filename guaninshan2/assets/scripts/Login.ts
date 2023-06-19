const { ccclass, property } = cc._decorator;
declare const firebase: any;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Button)
    loginBtn: cc.Button = null;

    @property(cc.Button)
    toRegister: cc.Button = null;

    private playerTs = null;

    start() {
        // init logic
        this.loginBtn.node.on(cc.Node.EventType.TOUCH_END, this.login, this);
        this.toRegister.node.on(cc.Node.EventType.TOUCH_END, () => { cc.director.loadScene("register"); }, this);
    }

    login = async () => {
        let email = cc.find("Canvas/menu_bg/Email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/menu_bg/Password").getComponent(cc.EditBox).string;
        // console.log(email, password);
        try {
            const reg = await firebase.auth().signInWithEmailAndPassword(email, password);
            const db = firebase.database();
            const path = db.ref('users/' + reg.user.uid);
            await path.once("value").then((snapshot) => {
                const data = snapshot.val();
                alert("Welcome " + data.username);
                cc.find("persistnode").getComponent("persistNode").name = data.username;
                cc.find("persistnode").getComponent('persistNode').score = data.score;
                this.scheduleOnce(() => { cc.director.loadScene("Selectstage"); }, 1);
            }).catch((error) => {
                console.error("Error fetching data: ", error.message);
            });
        } catch (err) {
            alert(err.message);
        }
    }
}
