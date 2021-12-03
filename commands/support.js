module.exports = {
    name: 'support',
    aliases: [],
    permissions: [],
    description: 'server support functions',
    async execute(message, client) {
        const channel = await message.guild.channels.create(`Ticket: ${message.author.tag}`)

        const userId = message.author.id
    
        channel.setParent(process.env.SUPPORT_CATEGORY)

        channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGE: false,
            VIEW_CHANNEL: false,
        })

        channel.updateOverwrite(message.author, {
            SEND_MESSAGE: true,
            VIEW_CHANNEL: true,
        })
        const reactionMessage = await channel.send({embed: {
            color: 10988550,
            title: "Support request",
            description: "You have opened a support request. In this channel, you can outline the essence of the request. Start by stating the reason for the request.",
            thumbnail: {
                "url": "https://eternalrpg.com/logo-sm-square.png"
            },
            fields: [{
                    name: "Suggested reasons",
                    value: `- I found a bug \n- I witnessed the breaking of the rules \n- I have a suggestion \n- Other`
                },
                {
                    name: "How to correctly state the essence of the request",
                    value: "Please state only the facts. If your request is related to a bug, then describe how, where and under what conditions a bug was noticed. If you want to complain about a violation of the rules, then indicate the nickname of the offender, what exactly and when it happened, if required, add the coordinates and a screenshot."
                },
                {
                    name: "What is the procedure?",
                    value: "An administrator or another staff member will accept your request and ask questions if required. After closing a request, this channel will be automatically deleted."
                },
                {
                    name: "Communication rules ",
                    value: "Eternal Games team is here to help and make your life easier. Please refrain from obscenities and other defiant behavior. Violators will be permanently removed from our Discord server."
                }
            ]
          }
        })
        
        try {
            await reactionMessage.react("✅")
            await reactionMessage.react("🔒")
            await reactionMessage.react("⛔")
        } catch (err) {
            channel.send("Error sending emojis!")
            throw err;
        }
        const collector = reactionMessage.createReactionCollector(
            (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
            { dispose: true }
        )

        collector.on("collect", (reaction, user) => {
            switch (reaction.emoji.name) {
                case "✅":
                    channel.send("The request was processed successfully.")
                    client.users.cache.get(userId).send(`Your support ticket has been processed successfully. \nTicket closed.`)
                    channel.send("The channel will be deleted in 5 seconds!")
                    setTimeout(() => channel.delete(), 5000)
                    break
                case "🔒":
                    channel.send("The channel is blocked, you can no longer send messages.")
                    channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
                    break
                case "⛔":
                    channel.send("Request rejected.")
                    client.users.cache.get(userId).send(`Your ticket was rejected.`)
                    channel.send("The channel will be deleted in 5 seconds!")
                    setTimeout(() => channel.delete(), 5000)
                    break
            }
        })

        message.channel
            .send(`Support request submitted successfully! Please continue: ${channel}`)
            .then((msg) => {
                setTimeout(() => msg.delete(), 7000);
                setTimeout(() => message.delete(), 3000);
            })
            .catch((err) => {
                throw err;
            });
  },
}