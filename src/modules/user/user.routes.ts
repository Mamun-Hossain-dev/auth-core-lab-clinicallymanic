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

// auth BEFORE validateRequest → 401 Unauthorized before we even parse the body
router.post(
  '/',
  auth(userRole.admin),
  validateRequest(createUserZodSchema),
  userController.createUser
)

// GET /:id — auth user or admin can fetch a profile (protect from public access)
router.get(
  '/:id',
  auth(userRole.admin, userRole.user),
  validateRequest(getUserParamZodSchema),
  userController.getUserById
)

// GET / — only admin can list all users
router.get('/', auth(userRole.admin), validateRequest(getAllUsersZodSchema), userController.getAllUsers)

router.patch(
  '/:id',
  auth(userRole.admin, userRole.user),
  fileUploader.upload.single('profileImage'),
  parseData,
  validateRequest(updateUserZodSchema),
  userController.updateUserById
)

// DELETE — only admin can soft-delete users
router.delete(
  '/:id',
  auth(userRole.admin),
  validateRequest(getUserParamZodSchema),
  userController.deleteUserById
)

export const userRoutes = router
