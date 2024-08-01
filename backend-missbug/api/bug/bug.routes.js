import express from 'express'
import { addBug, getBug, getBugs, getLabels, getpdf, removeBug, updateBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/getpdf', getpdf)
router.get('/getlabels', getLabels)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.post('/', addBug)
router.put('/', updateBug)

export const bugRoutes = router