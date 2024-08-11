const { DEV, VITE_LOCAL } = import.meta.env

import { msgService as local } from './msg.service.local'
import { msgService as remote } from './msg.service'

// export const isRemote = VITE_LOCAL !== 'true'
const isRmote = true
export const msgService = isRmote ? remote : local

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.msgService = msgService
