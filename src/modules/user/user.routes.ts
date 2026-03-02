import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import parseData from '../../middlewares/parseData'
import { userController } from './user.controller'
import {
  createUserZodSchema,
  getAllUsersZodSchema,
  getUserParamZodSchema,
  updateUserZodSchema,
} from './user.validation'
import auth from '../../middlewares/auth'
import { userRole } from './user.constants'
import { fileUploader } from '../../utils/fileUpload'

const router = express.Router()

router.post(
  '/',
  validateRequest(createUserZodSchema),
  auth(userRole.admin),
  userController.createUser
)

router.get('/:id', validateRequest(getUserParamZodSchema), userController.getUserById)

router.get('/', validateRequest(getAllUsersZodSchema), userController.getAllUsers)

router.patch(
  '/:id',
  auth(userRole.admin, userRole.user),
  fileUploader.upload.single('profileImage'),
  parseData,
  validateRequest(updateUserZodSchema),
  userController.updateUserById
)

router.delete('/:id', validateRequest(getUserParamZodSchema), userController.deleteUserById)

export const userRoutes = router
