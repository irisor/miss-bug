import express from 'express'
import { addUser ,getUser, getUsers, deleteUser, updateUser } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUser)
router.put('/', updateUser)
router.delete('/:id', deleteUser)

export const userRoutes = router