// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
declare const firebase: any;

@ccclass
export default class Win extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    score = 250;

    playerRole = null;

    move_node = null;

    username = null;

    oncounter = 0;

    available = false;

    showScore = 0;

    writefinished = false;

    onLoad() {
        this.score = cc.find("persistnode").getComponent("persistNode").OneScore;
        console.log("onscore", this.score)
        // this.playerRole = cc.find("persistnode").getComponent("persistNode").playerRole;
        cc.find("Canvas/Board").opacity = 0;
        cc.find("Canvas/My").opacity = 0;
        cc.find("Canvas/tap").opacity = 0;
        if (cc.find("persistnode").getComponent("persistNode").win == 1) {
            cc.find("Canvas/Win").getComponent(cc.Label).string = "称霸武林";
        } else {
            cc.find("Canvas/Win").getComponent(cc.Label).string = "无力回天";
        }
        this.playerRole = cc.find("persistnode").getComponent("persistNode").playerRole;
        if (this.playerRole == "selling") {
            this.move_node = cc.find("Canvas/selling");
        }
        else if (this.playerRole == "tanmen") {
            this.move_node = cc.find("Canvas/tanmen");
        }
        else if (this.playerRole == "errmei") {
            this.move_node = cc.find("Canvas/errmei");
        }
        this.move_node.active = true;
        this.move_node.opacity = 0;
        console.log(this.move_node);
        this.writefinished = false;
        this.Initfirebase();

        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    start() {
        this.schedule(() => { this.available = true; }, 1.5)
        // this.Initfirebase();
        this.moving();
        // this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        //     cc.director.loadScene("Selectstage");
        // }, this);

    }
    update(dt) {
        console.log(this.score)
        if (this.available && this.showScore < this.score) {

            this.showScore += Math.ceil(this.score / 100);
        }
        cc.find("Canvas/My/score").getComponent(cc.Label).string = (this.showScore > this.score) ? this.score.toString() : this.showScore.toString();
        if (this.available && this.showScore >= this.score && this.writefinished) {
            cc.find("Canvas/tap").opacity = 255;
            this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                cc.director.loadScene("Selectstage");
            }, this);
        }
    }

    Initboard() {
        firebase.database().ref('users/').orderByChild('score').limitToLast(3).once('value').then((snapshot) => {
            var user = [];
            var score = [];
            snapshot.forEach((childSnapshot) => {
                user.push(childSnapshot.val().username);
                score.push(childSnapshot.val().score);
            });
            user.reverse();
            score.reverse();
            for (var i = 0; i < 3; i++) {
                cc.find("Canvas/Board/" + String(i + 1)).getComponent(cc.Label).string = String(i + 1);
                cc.find("Canvas/Board/" + String(i + 1) + "/user").getComponent(cc.Label).string = user[i];
                cc.find("Canvas/Board/" + String(i + 1) + "/score").getComponent(cc.Label).string = score[i];
            }
            cc.find("Canvas/My/user").getComponent(cc.Label).string = this.username;

        });
    }
    async Initfirebase() {
        // add score value to firebase
        //var score = 0;
        const user = firebase.auth().currentUser;
        if (user) {
            console.log(user);
            firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
                this.username = snapshot.val().username;
                this.score += snapshot.val().score;
                if (cc.find("persistnode").getComponent("persistNode").win == 1) {
                    this.score += 50;
                } else {
                    this.score -= 10;
                }

                if (this.score < 0) this.score = 0;
                firebase.database().ref('users/' + user.uid).update({
                    score: this.score,
                });
                cc.find("persistnode").getComponent("persistNode").score = this.score;
                this.Initboard();
            });
        }
        else {
            console.log("no user");
        }

        this.writefinished = true;
    }
    moving() {
        // this.move_node.opacity = 0;
        cc.tween(this.move_node)
            .to(1, { position: cc.v2(-224, 0), opacity: 255, easing: 'sineOut' })
            .call(() => {

            })
            .start();
        cc.tween(cc.find("Canvas/Board"))
            .delay(1.4)
            .to(1, { opacity: 255 })
            .start();
        cc.tween(cc.find("Canvas/My"))
            .delay(1.4)
            .to(1, { opacity: 255 })
            .start();

    }
    // update (dt) {}
}