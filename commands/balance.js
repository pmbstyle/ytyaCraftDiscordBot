const profileModel = require('../models/profile')
module.exports = {
    name: 'balance',
    aliases: [],
    permissions: [],
    description: 'show tester coins',
    async execute(message) {

        const userID = message.author.tag

        let profileData
        try {
            profileData = await profileModel.findOne({discordID: userID})
            if(profileData) {
                message.reply({embed: {
                    color: 10988550,
                    title: "Баланс "+profileData.discordID,
                    footer: {
                        "text": "сообщение будет удалено через 10 секунд"
                    },
                    thumbnail: {
                      "url": "http://ytyacraft.ru/images/coins.png"
                    },
                    fields: [
                      {
                        name: "Tester Coins",
                        value: "💰 "+profileData.coins
                      }
                    ]
                  }
                }).then(msg => {
                    setTimeout(() => message.delete(), 10000);
                    setTimeout(() => msg.delete(), 10000);
                })
            } else {
                message.reply('Что-то пошло не так.').then(msg => {
                    setTimeout(() => message.delete(), 5000);
                    setTimeout(() => msg.delete(), 5000);
                })
            }
        } catch (err) {
            console.log(err)
        }        
  },
}