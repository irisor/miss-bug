import express from 'express'
import { addBug, getBug, getBugs, getLabels, getpdf, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'
import { checkVisits } from '../../middlewares/check-visits.middleware.js'

const router = express.Router()

router.get('/', log, getBugs)
router.get('/getpdf', log, getpdf)
router.get('/getlabels', log, getLabels)
router.get('/:bugId', log, checkVisits, getBug)
router.delete('/:bugId', log, requireAuth, removeBug)
router.post('/', log, requireAuth, addBug)
router.put('/', log, requireAuth, updateBug)

export const bugRoutes = router