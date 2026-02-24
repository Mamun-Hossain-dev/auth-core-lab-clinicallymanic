import express from 'express'
import { BannerController } from './banner.controller'
import auth from '../../middlewares/auth'
import { userRole } from '../user/user.constants'
import { fileUploader } from '../../utils/fileUpload'
import validateRequest from '../../middlewares/validateRequest'
import {
  createBannerZodSchema,
  getAllBannerQueryZodSchema,
  getBannerParamZodSchema,
} from './banner.validation'

const router = express.Router()

router.post(
  '/',
  auth(userRole.admin),
  fileUploader.upload.single('bannerImage'),
  validateRequest(createBannerZodSchema),
  BannerController.createBanner
)

router.get('/:id', validateRequest(getBannerParamZodSchema), BannerController.getBanner)

router.get('/', validateRequest(getAllBannerQueryZodSchema))

router.patch(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('bannerImage'),
  BannerController.updateBanner
)

router.delete(
  '/:id',
  auth(userRole.admin),
  validateRequest(getBannerParamZodSchema),
  BannerController.deleteBanner
)

export const bannerRoutes = router
