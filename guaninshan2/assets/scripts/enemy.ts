// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private life: number;
    private isdead: boolean;

    onLoad() {
        this.life = 100;
        this.isdead = false;
    }


    update(dt) {
        if (this.life <= 0) {
            this.isdead = true;
            this.life = 100;
        }
    }

    onCollisionEnter(other, self) {
        console.log("hello knife touch");
        if (other.node.group == 'knife') {
            console.log("hurts");
            this.life -= 10;
        }
    }
}
