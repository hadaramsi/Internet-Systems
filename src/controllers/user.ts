import User from '../models/user_model'
import { Request, Response } from 'express'



const getAllUsers = async (req: Request, res: Response) => {
    console.log('getAllUsers')

    try {
        let users = {}
        users = await User.find()
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get user from db" })
    }
}

const getUserById = async (req: Request, res: Response) => {
    console.log(req.params.id)
    try {
        const users = await User.findById(req.params.id)
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get users from db" })
    }
}


const addNewUser = async (req: Request, res: Response) => {
    console.log(req.body)

    const user = new User({
        _id: req.body._id,
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
    })

    try {
        const newUser = await user.save()
        console.log("save user in db")
        res.status(200).send(newUser)
    } catch (err) {
        console.log("fail to save user in db " + err)
        res.status(400).send({ 'error': 'fail adding new user to db' })
    }
}


export = { getAllUsers, getUserById, addNewUser }
