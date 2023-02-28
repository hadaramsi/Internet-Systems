import User from '../models/user_model'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'


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
    //console.log("GETTTTTTTTTTTTTTTTTTuSER")
    console.log(req.params.id)
    try {
        const users = await User.findById(req.params.id)
        res.status(200).send(users)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get users from db" })
    }
}
const putUserById = async (req: Request, res: Response) => {
    console.log("PUTuSER")
    if (req.body.password != undefined) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        console.log("save update user in db")
        res.status(200).send(user)
    } catch (err) {
        console.log("fail to update user in db")
        res.status(400).send({ error: "fail to update user in db" })
    }

}


const addNewUser = async (req: Request, res: Response) => {
    console.log(req.body)

    const user = new User({
        _email: req.body._email,
        password: req.body.password,
        fullName: req.body.fullName,
        image: req.body.image,
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


export = { getAllUsers, getUserById, addNewUser, putUserById }
