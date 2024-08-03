import fs from 'fs'
import { makeId, readJsonFile } from '../../services/util.service.js'


const users = readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername,
}



function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')
    return Promise.resolve(user)
}

async function remove(userId) {
    try {
        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx === -1) throw `Couldn't remove user with _id ${userId}`
        users.splice(userIdx, 1)
        return _saveUsersToFile()
    } catch (err) {
        loggerService.error(`Couldn't get user`, err);
        throw err
    }
}

async function save(userToSave) {
    try {
		if (userToSave._id) {
			const idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw `Couldn't update user with _id ${userToSave._id}`
            users[idx] = {...users[idx], ...userToSave} // update the user with the new userToSave
            userToSave = users[idx]
        } else {
			userToSave._id = makeId()
            users.push(userToSave)
        }
        await _saveUsersToFile()
        return userToSave
    } catch (err) {
        loggerService.error(`Couldn't get user`, err);
        throw err
    }
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        // if (!user) throw `User not found by username : ${username}`
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}
