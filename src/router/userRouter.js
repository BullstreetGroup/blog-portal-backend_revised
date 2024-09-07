import express from 'express'
import {
  changeEmail,
  changePassword,
  currentUser,
  login,
  register,
} from '../controller/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
const userRouter = express.Router()

userRouter.get('/user', authMiddleware, currentUser)
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.put('/change-password', authMiddleware, changePassword)
userRouter.put('/change-email', authMiddleware, changeEmail)

export default userRouter
