const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    discordID: {type: String, require: true, unique: true},
    discord_user_id: {type: String, require: true, unique: true},
    minecraftID: {type: String, require: true, unique: true},
    coins: {type: Number, default: 0}
})

const model = mongoose.model("Profile", profileSchema)

module.exports = model