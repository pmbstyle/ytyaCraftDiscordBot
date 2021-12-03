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
                    title: "Balance "+profileData.discordID,
                    footer: {
                        "text": "message will be deleted in 10 seconds"
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
                message.reply('Something went wrong.').then(msg => {
                    setTimeout(() => message.delete(), 5000);
                    setTimeout(() => msg.delete(), 5000);
                })
            }
        } catch (err) {
            console.log(err)
        }        
  },
}