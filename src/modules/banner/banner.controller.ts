import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BannerService } from './banner.service'

const createBanner = catchAsync(async (req, res) => {
  const userId = req.user?.id
  const file = req.file
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body
  const result = await BannerService.createBanner(userId, fromData, file as Express.Multer.File)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Banner created successfully',
    data: result,
  })
})
