import express from 'express'
import { login, logout, signup } from './auth.controller.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
// router.post('/login', (req, res) => {
// 	res.send('test')
// })

export const authRoutes = router