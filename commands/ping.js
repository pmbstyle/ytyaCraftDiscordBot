module.exports = {
    name: 'ping',
    description: 'ping-pong test',
    execute(message, args) {
        message.channel.send('понг бля, заебал')
    }
}