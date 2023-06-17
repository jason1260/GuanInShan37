// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const gameInfo = {
    weaponWeight: {
        knife: 30,
        stick: 40,
        gun: 50,
        rifle: 70,
        sniper: 100
    },
    weaponbulletNum: {
        knife: 1,
        stick: 1,
        gun: 10,
        rifle: 20,
        sniper: 2
    },
    weaponAttackTime: {
        knife: 0.02,
        stick: 0.1,
        gun: 0.5,
        rifle: 0.2,
        sniper: 1
    },
    rangedWeapon: ['gun', 'rifle', 'sniper'],
    nearWeapon: ['knife'],
    weaponRadius: {
        reload: 1,
        changing: 1,
        knife: 1,
        stick: 1,
        gun: 1,
        rifle: 1.5,
        sniper: 0.5
    },
    dropsTag2weapon: {
        0: 'rifle',
        1: 'sniper',
        2: 'stick'
    },
    weaponDamage: {
        knife: 15,
        stick: 10,
        gun: 15,
        rifle: 10,
        sniper: 80
    },
    bulletVelocity: {
        knife: 1,
        stick: 1,
        gun: 1000,
        rifle: 1000,
        sniper: 1000
    },
    roleHP: {
        selling: 130,
        tanmen: 85,
        errmei: 100
    },
    roleSpeed: {
        selling: 180,
        tanmen: 220,
        errmei: 200
    },
    roleChangeWeaponRadius: {
        selling: 0,
        tanmen: 180,
        errmei: 150
    },
    roleNextWeapon: {
        selling: "stick",
        tanmen: "rifle",
        errmei: "sniper",
    }
}

export = gameInfo;