import express from 'express'
import { addUser ,getUser, getUsers, deleteUser, updateUser } from './user.controller.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', requireAuth, addUser)
router.put('/', requireAuth, updateUser)
router.delete('/:id', requireAuth, deleteUser)

export const userRoutes = router