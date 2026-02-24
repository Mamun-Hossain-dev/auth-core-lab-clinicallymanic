import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
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
  // fileUploader.upload.array("images", 5),
  validateRequest(getUserParamZodSchema),
  validateRequest(updateUserZodSchema),
  auth(userRole.admin, userRole.user),
  userController.updateUserById
)

router.delete('/:id', validateRequest(getUserParamZodSchema), userController.deleteUserById)

export const userRoutes = router
