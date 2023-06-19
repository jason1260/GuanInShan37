const { ccclass, property } = cc._decorator;
declare const firebase: any;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Button)
    loginBtn: cc.Button = null;

    @property(cc.Button)
    toRegister: cc.Button = null;

    @property(cc.Node)
    loginLabel: cc.Node = null;

    @property(cc.Node)
    registerLabel: cc.Node = null;

    private playerTs = null;

    start() {
        // init logic
        this.loginBtn.node.on(cc.Node.EventType.TOUCH_END, this.login, this);
        this.loginBtn.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.btnhover(this.loginLabel, 0) }, this)
        this.loginBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.btnhover(this.loginLabel, 1) }, this)
        this.toRegister.node.on(cc.Node.EventType.MOUSE_ENTER, () => { this.btnhover(this.registerLabel, 0) }, this)
        this.toRegister.node.on(cc.Node.EventType.MOUSE_LEAVE, () => { this.btnhover(this.registerLabel, 1) }, this)
        this.toRegister.node.on(cc.Node.EventType.TOUCH_END, () => { cc.director.loadScene("register"); }, this);
    }

    btnhover(node: cc.Node, type: number) {
        if (type === 0) node.color = cc.Color.GRAY;
        else node.color = cc.Color.WHITE;
    }

    login = async () => {
        let email = cc.find("Canvas/Email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/Password").getComponent(cc.EditBox).string;
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
