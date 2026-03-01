import express from 'express'
import { EventController } from './event.controller'
import auth from '../../middlewares/auth'
import { userRole } from '../user/user.constants'
import { fileUploader } from '../../utils/fileUpload'
import validateRequest from '../../middlewares/validateRequest'
import parseData from '../../middlewares/parseData'
import {
    createEventZodSchema,
    getAllEventQueryZodSchema,
    getEventParamZodSchema,
    updateEventZodSchema,
} from './event.validation'

const router = express.Router()

router.post(
    '/',
    auth(userRole.admin),
    fileUploader.upload.single('thumbnail'),
    parseData,
    validateRequest(createEventZodSchema),
    EventController.createEvent
)

router.get('/:id', validateRequest(getEventParamZodSchema), EventController.getEventById)

router.get('/', validateRequest(getAllEventQueryZodSchema), EventController.getAllEvent)

router.patch(
    '/:id',
    auth(userRole.admin),
    fileUploader.upload.single('thumbnail'),
    parseData,
    validateRequest(updateEventZodSchema),
    EventController.updateEvent
)

router.delete(
    '/:id',
    auth(userRole.admin),
    validateRequest(getEventParamZodSchema),
    EventController.deleteEvent
)

export const eventRoutes = router
