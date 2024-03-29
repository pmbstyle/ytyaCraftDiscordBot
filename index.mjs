import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const Discord = require('discord.js')
import { Rcon } from "rcon-client"
const fs = require('fs')
require('dotenv').config()
const mongoose = require('mongoose')

const client = new Discord.Client()

const rcon = new Rcon({ host: process.env.RPG_IP, port: process.env.RPG_PORT, password: process.env.RPG_PASSWORD })

const prefix = '!'

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))

for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}


client.on('ready', () => {
	console.log('Discord client is ready')
    //tryConnection()
})

client.on('message', message => {
    let userId = message.author.id

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ')
    const command = args.shift().toLowerCase()

    if(message.channel instanceof Discord.DMChannel && command != 'balance') {
        console.log('DM msg from '+message.author.tag+' with command '+command)
        return
    }
    if(message.channel.id == process.env.WELCOME_CHANNEL && !message.content.startsWith(prefix) && !message.author.bot && !message.guild.members.cache.find((member) => member.id === userId).hasPermission("ADMINISTRATOR")) {
        message.delete()
        return
    }
    if(message.channel.id == process.env.SUPPORT_CHANNEL && !message.content.startsWith(prefix) && !message.author.bot && !message.guild.members.cache.find((member) => member.id === userId).hasPermission("ADMINISTRATOR")) {
        message.delete()
        return
    }

    switch(command) {
        // case 'application':
        //     message.channel.id == process.env.WELCOME_CHANNEL ? client.commands.get('signin').execute(message, args, client, rcon) : message.reply('Invalid command.')
        //     break
        case 'support':
            message.channel.id == process.env.SUPPORT_CHANNEL || message.channel.id == process.env.SUPPORT_CHANNEL2 ? client.commands.get('support').execute(message, client) : message.reply('Invalid command.')
            break
        // case 'getuser':
        //     message.channel.id == process.env.GM_CHANNEL ? client.commands.get('getuser').execute(message, args, client, rcon) : message.reply('Invalid command.')
        //     break
        // case 'addcoins':
        //     message.guild.members.cache.find((member) => member.id === userId).hasPermission("ADMINISTRATOR") ? client.commands.get('addcoins').execute(message, args, client) : message.reply('Invalid command.')
        //     break
        // case 'balance':
        //     client.commands.get('balance').execute(message)
        //     break
        default:
            message.channel.id == process.env.WELCOME_CHANNEL || message.channel.id == process.env.SUPPORT_CHANNEL || message.channel.id == process.env.SUPPORT_CHANNEL2 ? message.delete() : ''
            break
    }
})

client.login(process.env.TOKEN)

// mongoose.connect(process.env.MONGODB_SRV, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// }).then(()=> {
//     console.log('Connected to MongoDB')
// }).catch((err) => {
//     console.log('Alarm!')
//     console.log(err)
// })

// async function tryConnection(){
// 	try {
// 		await rcon.connect()
// 	}
// 	catch(e){
// 		console.log('RCON unavailable')
// 	}
// 	rcon.end()
// }