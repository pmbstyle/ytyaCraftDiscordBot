module.exports = {
    name: 'signin',
    aliases: [],
    permissions: [],
    description: 'test server sign in functions',
    async execute(message, args, cmd, client, discord) {
        const channel = await message.guild.channels.create(`Заявка: ${message.author.tag}`)
    
        channel.setParent("843937545116057620")

        channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGE: false,
            VIEW_CHANNEL: false,
        })

        channel.updateOverwrite(message.author, {
            SEND_MESSAGE: true,
            VIEW_CHANNEL: true,
        })

        const reactionMessage = await channel.send("Спасибо, ваша заявка будет рассмотрена при первой возможности!");

        try {
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
                case "🔒":
                    channel.updateOverwrite(message.author, { SEND_MESSAGES: false })
                    break
                case "⛔":
                    channel.send("Канал будет удален через 5 секунд!")
                    setTimeout(() => channel.delete(), 5000)
                    break
            }
        })

        message.channel
            .send(`Заявка подана успешно! Подробнее: ${channel}`)
            .then((msg) => {
                setTimeout(() => msg.delete(), 7000);
                setTimeout(() => message.delete(), 3000);
            })
            .catch((err) => {
                throw err;
            });
  },
}