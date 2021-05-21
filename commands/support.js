module.exports = {
    name: 'support',
    aliases: [],
    permissions: [],
    description: 'test server support functions',
    async execute(message, client) {
        console.log(1)
        const channel = await message.guild.channels.create(`Тикет: ${message.author.tag}`)

        const userId = message.author.id
    
        channel.setParent(process.env.SUPPORT_CATEGORY)
        console.log(2)
        channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGE: false,
            VIEW_CHANNEL: false,
        })

        channel.updateOverwrite(message.author, {
            SEND_MESSAGE: true,
            VIEW_CHANNEL: true,
        })
        console.log(3)
        const reactionMessage = await channel.send({embed: {
            color: 10988550,
            title: "Запрос в поддержку",
            description: "Вы открыли запрос в поддержку. В этом канале вы можете изложить суть запроса. Начните с указания причины обращения.",
            thumbnail: {
                "url": "http://ytyacraft.ru/images/PNG-Server-Icon_RPG.png"
            },
            fields: [{
                    name: "Предлагаемые причины",
                    value: `- Я нашел баг\n- Я стал свидетелем нарушения правил\n- У меня есть предложение\n- Другое`
                },
                {
                    name: "Как правильно изложить суть обращения",
                    value: "Пожалуйста, излагайте только факты. Если ваше обращение связано с багом, то опишите как, где и при каких условиях баг был замечен. Если вы хотите пожаловаться на нарушение правил, то укажите ник нарушителя, что конкретно и когда произошло, добавьте координаты и скриншот, если требуется."
                },
                {
                    name: "Как все будет происходить?",
                    value: "Администратор, либо другой оператор поддержки примет ваше обращение и задаст вопросы если требуется. После закрытия запроса этот канал будет автоматически удален."
                },
                {
                    name: "Правила общения",
                    value: "Команда ytyaCraft здесь что бы помочь и сделать вашу жизнь проще. Пожалуйста, воздержитесь от мата и иного рода вызывающего поведения. Нарушители будут удалены из дс навсегда."
                }
            ]
          }
        })
        console.log(4)
        try {
            await reactionMessage.react("✅")
            await reactionMessage.react("🔒")
            await reactionMessage.react("⛔")
        } catch (err) {
            channel.send("Error sending emojis!")
            throw err;
        }
        console.log(5)
        const collector = reactionMessage.createReactionCollector(
            (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
            { dispose: true }
        )

        collector.on("collect", (reaction, user) => {
            switch (reaction.emoji.name) {
                case "✅":
                    channel.send("Запрос обработан успешно.")
                    client.users.cache.get(userId).send(`Ваша заявка в поддержку была успешно обработана.\nЗаявка закрыта.`)
                    channel.send("Канал будет удален через 5 секунд!")
                    setTimeout(() => channel.delete(), 5000)
                    break
                case "🔒":
                    channel.send("Канал заблокирован, вы больше не можете отправлять сообщения.")
                    channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
                    break
                case "⛔":
                    channel.send("Запрос отклонен")
                    client.users.cache.get(userId).send(`Ваш запрос в поддержку отклонен.`)
                    channel.send("Канал будет удален через 5 секунд!")
                    setTimeout(() => channel.delete(), 5000)
                    break
            }
        })

        message.channel
            .send(`Запрос в поддержку подан успешно! Подробнее: ${channel}`)
            .then((msg) => {
                setTimeout(() => msg.delete(), 7000);
                setTimeout(() => message.delete(), 3000);
            })
            .catch((err) => {
                throw err;
            });
  },
}