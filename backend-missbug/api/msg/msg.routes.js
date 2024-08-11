import express from 'express'

import { requireAuth } from '../../middlewares/require-auth.middleware.js'
import { log } from '../../middlewares/log.middleware.js'

import {addMsg, getMsgs, deleteMsg} from './msg.controller.js'

const router = express.Router()

router.get('/', log, getMsgs)
router.post('/',  log, requireAuth, addMsg)
router.delete('/:msgId',  requireAuth, deleteMsg)

export const msgRoutes = router