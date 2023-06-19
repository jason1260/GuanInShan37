// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
declare const firebase: any;
@ccclass
export default class Waiting extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    public roomListener  = null;
    public roomNum:number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        firebase.database().ref('/rooms')
        .orderByKey()
        .limitToFirst(1)
        .once('value')
        .then((snapshot) => {
            console.log(snapshot)
            const lastUserKey = Object.keys(snapshot.val())[0];
            console.log(lastUserKey)
            const lastUser = snapshot.val()[lastUserKey];
            console.log(lastUser)
            
            if (lastUser.num != 1) {
                const newUserKey = firebase.database().ref('/rooms').push().key;
                const newUser = {
                    num: 1,
                    A: {
                    rotate:0,
                    Input:{},
                    die: false,
                    x: -323.303,
                    y: -93.88,
                    role : cc.find("persistnode").getComponent("persistNode").playerRole,
                    },
                    B: {
                    rotate:0,
                    Input:{},
                    die: false,
                    x: -321.545,
                    y: 149.546,
                    role : "null"
                    }
                }
                const updates = {};
                updates['/rooms/' + newUserKey] = newUser;
                firebase.database().ref().update(updates)
                .then(() => {
                    cc.find("persistnode").getComponent("persistNode").room = newUserKey;
                    cc.find("persistnode").getComponent("persistNode").mulRole = "A";
                    this.roomListener  = firebase.database().ref('rooms/' + newUserKey).on('value', (snapshot) => {
                        const roomData = snapshot.val();
                        this.roomNum = (snapshot.val() && snapshot.val().num) || 0;
                        if(this.roomNum == 2){
                            cc.director.loadScene('mul');
                        }
                    });
                })
            }else{
                firebase.database().ref('/rooms/' + lastUserKey).update({
                    num:2,
                    B: {
                    rotate:0,
                    Input:{},
                    die: false,
                    x: -321.545,
                    y: 149.546,
                    role : cc.find("persistnode").getComponent("persistNode").playerRole,
                    }
                }).then(()=>{
                    cc.find("persistnode").getComponent("persistNode").room = lastUserKey;
                    cc.find("persistnode").getComponent("persistNode").mulRole = "B";
                    this.roomListener  = firebase.database().ref('rooms/' + lastUserKey).on('value', (snapshot) => {
                        const roomData = snapshot.val();
                        this.roomNum = (snapshot.val() && snapshot.val().num) || 0;
                        if(this.roomNum == 2){
                            cc.director.loadScene('mul');
                        }
                    });
                });
                
            }
        })
    }
    onDestroy() {
        firebase.database().ref('rooms/' + this.room).off('value', this.roomListener);
    }
    start () {
        
}
    
    update (dt) {

    }
}
