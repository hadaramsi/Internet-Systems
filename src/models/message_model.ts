const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    // reciver: {
    //     type: String,
    //     required: true
    // }
})

export = mongoose.model('Message', messageSchema)