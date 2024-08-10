import express from 'express'
import { addBug, getBug, getBugs, getLabels, getPdf, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'
import { checkVisits } from '../../middlewares/check-visits.middleware.js'

const router = express.Router()

router.get('/', log, getBugs)
 // The following 2 routes should come before the getBug route because the route structure is similar
router.get('/pdf', log, getPdf)
router.get('/labels', log, getLabels)

router.get('/:bugId', log, checkVisits, getBug)
router.delete('/:bugId', log, requireAuth, removeBug)
router.post('/', log, requireAuth, addBug)
router.put('/:bugId', log, requireAuth, updateBug)


export const bugRoutes = router