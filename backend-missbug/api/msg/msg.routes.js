import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/require-auth.middleware.js'
import { log } from '../../middlewares/log.middleware.js'

import {addMsg, getMsgs, deleteMsg} from './msg.controller.js'

const router = express.Router()

router.get('/', log, getMsgs)
router.post('/',  log, requireAuth, addMsg)
router.delete('/:msgId',  requireAuth, requireAdmin,deleteMsg)

export const msgRoutes = router