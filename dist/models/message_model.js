"use strict";
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    reciver: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Message', messageSchema);
//# sourceMappingURL=message_model.js.map