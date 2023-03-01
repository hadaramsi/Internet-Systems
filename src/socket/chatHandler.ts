import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import request from "../request"
import messageController from "../controllers/message"

export = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const sendMessage = async (payload) => {
        console.log('chat:send_message')
        // const to = payload.to
        const message = payload.message
        const from = socket.data.user
        // io.to(to).emit("chat:message", { 'to': to, 'from': from, 'message': message })
        try {
            const response = await messageController.addNewMessage(
                new request(payload, from, null, null)
            )
            io.emit("chat:message", {
                // to: to,
                from: from,
                message: message,
                res: response,
            })
        } catch (err) {
            socket.emit("chat:message", { status: 'fail' })
        }
    }

    const getAllMessages = async (payload) => {
        console.log('chat:get_all_message')
        try {
            const response = await messageController.getAllMessages(
                new request(payload, socket.data.user, payload, null)
            )
            io.to(socket.data.user).emit('chat:get', response)
        } catch (err) {
            socket.emit('chat:get', { status: 'fail' })
        }
    }

    console.log('register chat handlers')
    socket.on("chat:send_message", sendMessage)
    socket.on('chat:get', getAllMessages)
}