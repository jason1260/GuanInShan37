// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const gameInfo = {
    weaponWeight : {
        knife:30,
        gun:50,
        rifle:70,
        sniper:100
    },
    weaponbulletNum : {
        knife:1,
        gun:10,
        rifle:20,
        sniper:5
    },
    weaponAttackTime : {
        knife: 0.02,
        gun:0.5,
        rifle:0.2,
        sniper:1
    },
    rangedWeapon : ['gun','rifle','sniper'],
    nearWeapon : ['knife'],
    weaponRadius : {
        reload:1,
        changing:1,
        knife:1,
        gun:1,
        rifle:1.5,
        sniper:0.5
    },
    dropsTag2weapon : {
        0:'rifle',
        1:'sniper'
    },
    weaponDamage: {
        knife:15,
        gun:15,
        rifle:10,
        sniper:80
    },
    bulletVelocity: {
        knife:1,
        gun:100,
        rifle:1000,
        sniper:1000
    }
}

export = gameInfo;