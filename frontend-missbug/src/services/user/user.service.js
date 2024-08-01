
import Axios from "axios"
const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/user' 

export const userService = {
    query,
    getById,
    save,
    remove,
}


async function query(filterBy = {}) {
    try {
        let filterByToSend = {...filterBy}
        Object.keys(filterByToSend).forEach(key => {
            if (Array.isArray(filterByToSend[key])) {
                filterByToSend[key] = filterByToSend[key].join(',')
            }
        })
        let { data: users } = await axios.get(BASE_URL, { params: filterByToSend })
        return users
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function getById(userId) {
    try {
        console.log("fe userservice getById", userId, BASE_URL + '/' + userId)
        let { data: user } = await axios.get(BASE_URL + '/' + userId)
        return user
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function remove(userId) {
    const url = BASE_URL + '/' + userId
    try {
        let { data } = await axios.delete(url)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function save(userToSave) {
    try {
        const method = userToSave._id ? 'put' : 'post'
        const { data: savedUser } = await axios[method](BASE_URL, userToSave)
        return savedUser
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
