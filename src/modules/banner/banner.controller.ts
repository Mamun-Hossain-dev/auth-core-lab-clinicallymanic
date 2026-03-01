import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BannerService } from './banner.service'
import { BannerFilterOptions, BannerPaginationOptions } from './banner.validation'

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const file = req.file as Express.Multer.File
  const result = await BannerService.createBanner(userId as string, req.body, file)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Banner created successfully',
    data: result,
  })
})

const getBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BannerService.getBanner(id as string)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner retrieved successfully',
    data: result,
  })
})

const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = req.query as BannerFilterOptions
  const paginationOptions = req.query as BannerPaginationOptions

  const results = await BannerService.getAllBanner(filterOptions, paginationOptions)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All banners retrieved successfully',
    data: results.data,
    meta: results.meta,
  })
})

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const file = req.file as Express.Multer.File

  const result = await BannerService.updateBanner(id as string, file, req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  })
})

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BannerService.deleteBanner(id as string)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  })
})

export const BannerController = {
  createBanner,
  getBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
}
