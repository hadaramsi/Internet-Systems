import User from '../models/user_model'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function sendError(status: number, res: Response, error: string) {
    res.status(status).send({
        'err': error
    })
}

const register = async (req: Request, res: Response) => {
    console.log("killlll meeeeee")
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    const fullName = req.body.fullName
    const image = req.body.image


    if (email == null || password == null || fullName == null) {
        return sendError(400, res, 'please provide valid email and password')
    }

    try {
        const user = await User.findOne({ 'email': email })
        if (user != null) {
            return sendError(400, res, 'user already registered, try a different name')
        }

        const salt = await bcrypt.genSalt(10)
        const encryptedPwd = await bcrypt.hash(password, salt)
        const newUser = new User({
            'email': email,
            'password': encryptedPwd,
            'fullName': fullName,
            'image': image
        })
        await newUser.save()
        return res.status(200).send({
            'email': newUser._email, //---------------------------------cheack---------------------
            '_id': newUser._id
        })
    } catch (err) {
        return sendError(400, res, 'fail ...')
    }
}


async function generateTokens(userId: string) {
    const accessToken = jwt.sign(
        { 'id': userId },
        process.env.ACCESS_TOKEN_SECRET,
        { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION }
    )
    const refreshToken = jwt.sign(
        { 'id': userId },
        process.env.REFRESH_TOKEN_SECRET
    )

    return { 'accessToken': accessToken, 'refreshToken': refreshToken }
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password
    // console.log(req.body)

    if (email == null || password == null) {
        return sendError(400, res, 'please provide valid email and password')
    }

    try {
        const user = await User.findOne({ 'email': email })
        if (user == null) return sendError(400, res, 'incorrect user or password')

        const match = await bcrypt.compare(password, user.password)
        if (!match) return sendError(400, res, 'incorrect user or password')

        const tokens = await generateTokens(user._id.toString())

        if (user.refresh_tokens == null) user.refresh_tokens = [tokens.refreshToken]
        else user.refresh_tokens.push(tokens.refreshToken)
        await user.save()

        return res.status(200).send({ "tokens": tokens, "userId": user._id })
    } catch (err) {
        console.log("error: " + err)
        return sendError(400, res, 'fail checking user')
    }
}

function getTokenFromRequest(req: Request): string {
    const authHeader = req.headers['authorization']
    if (authHeader == null) return null
    return authHeader.split(' ')[1]
}
type TokenInfo = {
    id: string
}
const refresh = async (req: Request, res: Response) => {
    console.log("heyyyyyy-------")
    const refreshToken = getTokenFromRequest(req)
    if (refreshToken == null) return sendError(400, res, 'authentication missing')

    try {
        console.log("heyyyyyy in try-------")
        const user: TokenInfo = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user.id)
        if (userObj == null) {
            console.log("heyyyyyy in try if 1-------")
            return sendError(400, res, 'fail validating token')
        }

        if (!userObj.refresh_tokens.includes(refreshToken)) {
            console.log("heyyyyyy in try if 2-------")
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(400, res, 'fail validating token')
        }

        const tokens = await generateTokens(userObj._id.toString())

        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = tokens.refreshToken
        console.log("refresh token: " + refreshToken)
        console.log("with token: " + tokens.refreshToken)
        await userObj.save()

        return res.status(200).send(tokens)
    } catch (err) {
        console.log("400 ----- heyyyyyy-------")
        return sendError(400, res, 'fail validating token')

    }
}

const logout = async (req: Request, res: Response) => {
    const refreshToken = getTokenFromRequest(req)
    if (refreshToken == null) return sendError(400, res, 'authentication missing')

    try {
        const user = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user.id)
        if (userObj == null) return sendError(400, res, 'fail validating token')

        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(400, res, 'fail validating token')
        }

        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken), 1)
        await userObj.save()
        return res.status(200).send()
    } catch (err) {
        return sendError(400, res, 'fail validating token')
    }
}

const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req)
    console.log("i am in authenticateMiddleware auth.ts")
    if (token == null) return sendError(400, res, 'authentication missing')
    try {
        const user = <TokenInfo>jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.body.userId = user.id
        console.log("token user: " + user)
        console.log("authenticateMiddleware pass ")
        return next()
    } catch (err) {
        console.log("authenticate Middle ware err ")
        return sendError(401, res, 'fail validating token')
    }

}

export = { login, refresh, register, logout, authenticateMiddleware }