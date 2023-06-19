const { ccclass, property } = cc._decorator;

@ccclass
export default class bgAnime extends cc.Component {

    @property(cc.Node)
    l1: cc.Node = null;

    @property(cc.Node)
    l2: cc.Node = null;

    @property(cc.Node)
    l3: cc.Node = null;

    li = [];

    currentIndex = 0;
    opacityIncrement = 10; // 透明度增加量
    delay = 0.05; // 延遲時間
    fadeOutDelay = 0.05 ; // 淡出延遲時間

    onLoad() {
        this.l1.opacity = 0;
        this.l2.opacity = 0;
        this.l3.opacity = 0;
        this.li.push(this.l1);
        this.li.push(this.l2);
        this.li.push(this.l3);
    }

    start() {
        this.scheduleOnce(() => {
            this.fadeInNextNode();
        }, this.delay);
    }

    fadeInNextNode() {
        const currentNode = this.li[this.currentIndex];
        if (currentNode) {
            currentNode.opacity += this.opacityIncrement;
            if (currentNode.opacity >= 150) {
                this.currentIndex++;
                this.scheduleOnce(() => {
                    this.fadeOutCurrentNode();
                }, this.fadeOutDelay);
            } else {
                this.scheduleOnce(() => {
                    this.fadeInNextNode();
                }, this.delay);
            }
        }else{
            this.currentIndex = 0;
            this.li.forEach((ele)=>{
                const minX = -270.303;
                const maxX = 271.929;
                const minY = -259.071;
                const maxY = 261.03;

                // 隨機產生 X 和 Y 座標
                const randomX = Math.random() * (maxX - minX) + minX;
                const randomY = Math.random() * (maxY - minY) + minY;

                // 建立 cc.Vec2 物件表示隨機點的座標
                const randomPoint = new cc.Vec2(randomX, randomY);
                ele.setPosition(randomPoint);
            })
            


            this.scheduleOnce(() => {
                this.fadeInNextNode();
            }, this.delay);


        }
    }

    fadeOutCurrentNode() {
        const currentNode = this.li[this.currentIndex - 1];
        if (currentNode) {
            currentNode.opacity -= this.opacityIncrement;
            if (currentNode.opacity <= 0) {
                currentNode.opacity = 0;
                this.scheduleOnce(() => {
                    this.fadeInNextNode();
                }, this.delay);
            } else {
                this.scheduleOnce(() => {
                    this.fadeOutCurrentNode();
                }, this.delay);
            }
        }
    }

    // update (dt) {}
}