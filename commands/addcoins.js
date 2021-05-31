const profileModel = require('../models/profile')
module.exports = {
    name: 'addcoins',
    aliases: [],
    permissions: [],
    description: 'add tester coins',
    async execute(message, args, client, ) {

        const userID = args[0]
        const coins = args[1]

        if(!coins) {
            message.reply('Что-то ты не то вводишь, отче, туда, но не то. Сколько сыпем то, ага?').then(msg => {
                setTimeout(() => message.delete(), 5000);
                setTimeout(() => msg.delete(), 5000);
            })
            return
        }

        let profileData
        try {
            profileData = await profileModel.findOneAndUpdate({minecraftID: userID},{$inc: {coins:coins}})
            if(profileData == null) {
              profileData = await profileModel.findOneAndUpdate({discordID: userID},{$inc: {coins:coins}})
            }
            if(profileData) {
                message.reply({embed: {
                    color: 3447003,
                    title: "Пользователь "+profileData.minecraftID,
                    thumbnail: {
                      "url": "http://ytyacraft.ru/images/PNG-Server-Icon_RPG.png"
                    },
                    fields: [{
                        name: "💬 Discrord ID",
                        value: profileData.discordID
                      },
                      {
                        name: "🧊 Minecraft ID",
                        value: profileData.minecraftID
                      },
                      {
                        name: "💰 Tester Coins (+"+coins+")",
                        value: parseInt(profileData.coins)+parseInt(coins)
                      }
                    ]
                  }
                })
                return
            } else {
                message.reply('Аккаунт с таким именем не зарегистрирован.').then(msg => {
                    setTimeout(() => message.delete(), 5000);
                    setTimeout(() => msg.delete(), 5000);
                })
            }
        } catch (err) {
            console.log(err)
        }        
  },
}