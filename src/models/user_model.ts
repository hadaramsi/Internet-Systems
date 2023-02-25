const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refresh_tokens: {
        type: [String]
    },
    fullName: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
})
export = mongoose.model('User', userSchema)