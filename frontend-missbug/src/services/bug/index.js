import { bugService as remoteService } from './bug.service.js'
import { bugService as localService } from './bug.service.local.js'

const isRemote = true

export const bugService = isRemote ? remoteService : localService