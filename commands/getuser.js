const profileModel = require('../models/profile')
module.exports = {
    name: 'getuser',
    aliases: [],
    permissions: [],
    description: 'display user data',
    async execute(message, args, client, rcon) {

        const userId = message.author.id

        const minecraftID = args[0]

        let profileData
        try {
            profileData = await profileModel.findOne({minecraftID: minecraftID})
            if(profileData) {
                await rcon.connect()
                let response = ''
                await rcon.send('authme getip '+args[0]).then(r => {response = r})
                rcon.end()
                let ipmask = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g
			    let t = response.match(ipmask)
                message.reply({embed: {
                    color: 3447003,
                    title: "Пользователь "+args[0],
                    fields: [{
                        name: "Discrord ID",
                        value: profileData.discordID
                      },
                      {
                        name: "Minecraft ID",
                        value: profileData.minecraftID
                      },
                      {
                        name: "Последний раз заходил с IP",
                        value: "["+t[0]+"](https://whatismyipaddress.com/ip/"+t[0]+")"
                      },
                      {
                        name: "Зарегистрирован с IP",
                        value: "["+t[1]+"](https://whatismyipaddress.com/ip/"+t[1]+")"
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