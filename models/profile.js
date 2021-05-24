const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    discordID: {type: String, require: true, unique: true},
    minecraftID: {type: String, require: true, unique: true}
})

const model = mongoose.model("Profile", profileSchema)

module.exports = model