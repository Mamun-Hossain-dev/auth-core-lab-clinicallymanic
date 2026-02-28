import express from 'express'
import { contactController } from './contact.controller'
import auth from '../../middlewares/auth'
import { userRole } from '../user/user.constants'
import validateRequest from '../../middlewares/validateRequest'
import {
  ContactCreateSchema,
  ContactGetAllSchema,
  ContactGetByIdSchema,
  ContactUpdateSchema,
} from './contact.validation'

const router = express.Router()

router.post(
  '/',
  auth(userRole.admin),
  validateRequest(ContactCreateSchema),
  contactController.createContact
)

router.get(
  '/:id',
  auth(userRole.admin),
  validateRequest(ContactGetByIdSchema),
  contactController.getContactById
)

router.get(
  '/',
  auth(userRole.admin),
  validateRequest(ContactGetAllSchema),
  contactController.getAllContact
)

router.patch(
  '/:id',
  auth(userRole.admin),
  validateRequest(ContactUpdateSchema),
  contactController.updateContact
)

router.delete(
  '/:id',
  auth(userRole.admin),
  validateRequest(ContactGetByIdSchema),
  contactController.deleteContact
)

export const contactRoutes = router
