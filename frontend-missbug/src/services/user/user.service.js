import Axios from 'axios'
import { utilService } from '../../services/util.service'

var axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

// const BASE_URL = (import.meta.env.DEV !== 'development') ?
//     '/api/' :
//     '//localhost:3030/api/'
const BASE_URL = !utilService.isDevelopment() ?
    '/api/' :
    '//localhost:3030/api/'
// const BASE_URL = '//localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,

    query,
    getById,
    remove,
    update,
    getEmptyUser
}

window.userService = userService

async function query() {
    const { data: users } = await axios.get(BASE_USER_URL)
    return users
}

async function getById(userId) {
    const { data: user } = await axios.get(BASE_USER_URL + userId)
    return user
}

async function remove(userId) {
    const { data: user } = await axios.delete(BASE_USER_URL + userId)
    return user
}

async function update(userToUpdate) {
    // const user = await getById(userToUpdate.id)
    // console.log('user', user)

    const { data: updatedUser } = await axios.put(BASE_USER_URL, userToUpdate)
    if (getLoggedinUser().id === updatedUser.id) saveLocalUser(updatedUser)
    return updatedUser
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)

    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    return saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin, imgUrl: user.imgUrl }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}


// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123', isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123',  isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123'})
// })()