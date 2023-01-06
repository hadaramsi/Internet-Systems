import Message from "../models/message_model"
import response from "../response"
import request from "../request"
import error from "../error"

const getAllMessages = async (req: request) => {
    try {
        let messages = {}
        if (req.query != null && req.query.sender != null) {
            messages = await Message.find({ sender: req.query.sender })
        } else if (req.query != null && req.query.reciver != null) {
            messages = await Message.find({ reciver: req.query.reciver })
        }
        return new response(messages, req.userId, null)
    } catch (err) {
        return new response(null, req.userId, new error(400, err.message))
    }
}

const addNewMessage = async (req: request) => {
    const msg = req.body["message"]
    const sender = req.userId
    const rec = req.body["to"]
    const message = new Message({
        body: msg,
        sender: sender,
        reciver: rec
    })
    try {
        const newMessage = await message.save()
        return new response(newMessage, sender, null)
    } catch (err) {
        return new response(null, sender, new error(400, err.message))
    }
}

export = { getAllMessages, addNewMessage };