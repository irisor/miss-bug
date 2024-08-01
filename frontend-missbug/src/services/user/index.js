import { userService as remoteService } from './user.service.js'
import { userService as localService } from './user.service.local.js'

const isRemote = true

export const userService = isRemote ? remoteService : localService