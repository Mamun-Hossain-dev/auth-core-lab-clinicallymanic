import express from 'express'
import { NewsletterController } from './newsletter.controller'
import auth from '../../middlewares/auth'
import { userRole } from '../user/user.constants'
import validateRequest from '../../middlewares/validateRequest'
import {
    broadcastNewsletterZodSchema,
    createNewsletterZodSchema,
    getAllNewsletterQueryZodSchema,
    getNewsletterParamZodSchema,
} from './newsletter.validation'

const router = express.Router()

router.post(
    '/',
    validateRequest(createNewsletterZodSchema),
    NewsletterController.createNewsletter
)

router.get(
    '/',
    auth(userRole.admin),
    validateRequest(getAllNewsletterQueryZodSchema),
    NewsletterController.getAllNewsletter
)

router.get(
    '/:id',
    auth(userRole.admin),
    validateRequest(getNewsletterParamZodSchema),
    NewsletterController.getSingleNewsletter
)

router.post(
    '/broadcast',
    auth(userRole.admin),
    validateRequest(broadcastNewsletterZodSchema),
    NewsletterController.broadcastNewsletter
)

router.delete(
    '/:id',
    auth(userRole.admin),
    validateRequest(getNewsletterParamZodSchema),
    NewsletterController.deleteNewsletter
)

export const newsletterRoutes = router
