import express from 'express'
import { OfferController } from './offer.controller'
import auth from '../../middlewares/auth'
import { userRole } from '../user/user.constants'
import { fileUploader } from '../../utils/fileUpload'
import validateRequest from '../../middlewares/validateRequest'
import parseData from '../../middlewares/parseData'
import {
    createOfferZodSchema,
    getAllOfferQueryZodSchema,
    getOfferParamZodSchema,
    updateOfferZodSchema,
} from './offer.validation'

const router = express.Router()

router.post(
    '/',
    auth(userRole.admin),
    fileUploader.upload.single('thumbnail'),
    parseData,
    validateRequest(createOfferZodSchema),
    OfferController.createOffer
)

router.get('/:id', validateRequest(getOfferParamZodSchema), OfferController.getOffer)

router.get('/', validateRequest(getAllOfferQueryZodSchema), OfferController.getAllOffers)

router.patch(
    '/:id',
    auth(userRole.admin),
    fileUploader.upload.single('thumbnail'),
    parseData,
    validateRequest(updateOfferZodSchema),
    OfferController.updateOffer
)

router.delete(
    '/:id',
    auth(userRole.admin),
    validateRequest(getOfferParamZodSchema),
    OfferController.deleteOffer
)

export const offerRoutes = router
