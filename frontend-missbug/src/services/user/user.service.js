import { httpService } from "../http.service"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

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
    const users = await httpService.get('user')
    return users
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    return user
}

async function remove(userId) {
    const user = await httpService.delete(`user/${userId}`)
    return user
}

async function update(userToUpdate) {
    // const user = await getById(userToUpdate.id)
    // console.log('user', user)

    const updatedUser = await httpService.put('user', userToUpdate)
    if (getLoggedinUser().id === updatedUser.id) saveLocalUser(updatedUser)
    return updatedUser
}

async function login(credentials) {
    const user = await httpService.post('auth/login', credentials)

    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(credentials) {
    const user = await httpService.post('auth/signup', credentials)
    return saveLocalUser(user)
}

async function logout() {
    await httpService.post('auth/logout')
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