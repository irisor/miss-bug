import { userService as remoteService } from './user.service.js'
import { userService as localService } from './user.service.local.js'
const { DEV, VITE_LOCAL } = import.meta.env

// let isRemote = VITE_LOCAL !== 'true'
const isRemote = true

export const userService = isRemote ? remoteService : localService

if (DEV) window.carService = userService