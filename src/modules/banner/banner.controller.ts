import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BannerService } from './banner.service'
import pick from '../../utils/pick'

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const file = req.file as Express.Multer.File
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body
  const result = await BannerService.createBanner(userId, fromData, file as Express.Multer.File)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Banner created successfully',
    data: result,
  })
})

const getBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const result = await BannerService.getBanner(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner retrieved successfully',
    data: result,
  })
})

const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = pick(req.query, ['searchTerm', 'category', 'status'])
  const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

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
  const { id } = req.params as { id: string }
  const file = req.file as Express.Multer.File
  const updateData = req.body.data ? JSON.parse(req.body.data) : req.body

  const result = await BannerService.updateBanner(id, file, updateData)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  })
})

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const result = await BannerService.deleteBanner(id)
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
