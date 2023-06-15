const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class Register extends cc.Component {

    @property(cc.Button)
    registerBtn: cc.Button = null;

    @property(cc.EditBox)
    nameLabel: cc.EditBox = null;

    @property(cc.EditBox)
    emailLabel: cc.EditBox = null;

    @property(cc.EditBox)
    passLabel: cc.EditBox = null;

    @property(cc.EditBox)
    rePassLabel: cc.EditBox = null;

    private playerTs = null;
    
    start () {
        // init logic
        this.registerBtn.node.on(cc.Node.EventType.TOUCH_END, this.register, this);
    }

    register = async () => {
        let username = this.nameLabel.string;
        let email = this.emailLabel.string;
        let password = this.passLabel.string;
        let repass = this.rePassLabel.string;
        if (password !== repass) {
            alert("Please check password again!");
        } else {
            try {
                console.log(username, password);
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
                    console.log("setUserComplete");
                    cc.director.loadScene("test");
                } catch(er) {
                    console.log(er.message);
                }
            } catch(error) {
                alert(error.message);
            }
        }
    }
}
