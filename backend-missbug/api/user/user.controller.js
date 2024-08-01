import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minBalance: +req.query.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function addUser(req, res) {
    console.log('usercontroller adduser')
    const { fullname, username, password, score } = req.body
    const userToSave = { fullname, username, password, score: +score }
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't add user`)
    }
}

export async function updateUser(req, res) {
    const { _id, fullname, username, password, score } = req.body
    const userToSave = { _id, fullname, username, password, score: +score }
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't save user`)
    }
}