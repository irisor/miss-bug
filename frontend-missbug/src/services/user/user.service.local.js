
import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'userDB'

export const userService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return storageService.query(STORAGE_KEY)
}
function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}
function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}
function save(user) {
    if (user._id) {
        return storageService.put(STORAGE_KEY, user)
    } else {
        return storageService.post(STORAGE_KEY, user)
    }
}
