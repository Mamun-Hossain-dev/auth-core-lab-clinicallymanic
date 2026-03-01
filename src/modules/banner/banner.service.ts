import { Types } from 'mongoose'
import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import pagination from '../../utils/pagination'
import {
  BannerFilterOptions,
  BannerPaginationOptions,
  CreateBannerInput,
  UpdateBannerInput,
} from './banner.validation'
import BannerModel from './banner.model'

const createBanner = async (
  userId: string,
  payload: CreateBannerInput,
  file: Express.Multer.File
) => {
  if (!file) {
    throw new AppError(400, 'Image file is required')
  }

  const bannerFile = await fileUploader.uploadToCloudinary(file)
  if (!bannerFile?.url) {
    throw new AppError(500, 'Image upload failed')
  }

  const result = await BannerModel.create({
    ...payload,
    bannerImageUrl: bannerFile.url,
    bannerImagePublicId: bannerFile.publicId,
    createdBy: new Types.ObjectId(userId),
  })

  return result
}

const getBanner = async (id: string) => {
  const banner = await BannerModel.findById(id).lean()
  if (!banner) {
    throw new AppError(404, 'Banner not found')
  }
  return banner
}

const getAllBanner = async (
  filterOptions: BannerFilterOptions,
  paginationOptions: BannerPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterOptions
  const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

  const query: Record<string, any> = {}

  if (searchTerm) {
    const searchableFields = ['title', 'description', 'category']
    query.$or = searchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }))
  }

  if (Object.keys(filterData).length > 0) {
    query.$and = Object.entries(filterData).map(([field, value]) => ({
      [field]: value,
    }))
  }

  const sortCondition: Record<string, 1 | -1> = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
  }

  const [result, total] = await Promise.all([
    BannerModel.find(query)
      .sort(sortCondition)
      .skip(skip as number)
      .limit(limit as number)
      .lean(),
    BannerModel.countDocuments(query),
  ])

  return {
    data: result,
    meta: { page, limit, total },
  }
}

const updateBanner = async (
  id: string,
  file: Express.Multer.File,
  updateData: UpdateBannerInput
) => {
  const banner = await BannerModel.findById(id).select('bannerImagePublicId').lean()
  if (!banner) {
    throw new AppError(404, 'Banner not found')
  }

  let finalUpdateData = { ...updateData }

  if (file) {
    if (banner.bannerImagePublicId) {
      await fileUploader.deleteFromCloudinary(banner.bannerImagePublicId)
    }

    const bannerFile = await fileUploader.uploadToCloudinary(file)
    if (!bannerFile?.url) {
      throw new AppError(500, 'Image upload failed')
    }
    finalUpdateData.bannerImageUrl = bannerFile.url
    finalUpdateData.bannerImagePublicId = bannerFile.publicId
  }

  const updatedBanner = await BannerModel.findByIdAndUpdate(id, finalUpdateData, {
    new: true,
    runValidators: true,
  }).lean()

  return updatedBanner
}

const deleteBanner = async (id: string) => {
  const banner = await BannerModel.findById(id).select('bannerImagePublicId').lean()
  if (!banner) {
    throw new AppError(404, 'Banner not found')
  }

  if (banner.bannerImagePublicId) {
    await fileUploader.deleteFromCloudinary(banner.bannerImagePublicId)
  }

  return await BannerModel.findByIdAndDelete(id).lean()
}

export const BannerService = {
  createBanner,
  getBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
}
