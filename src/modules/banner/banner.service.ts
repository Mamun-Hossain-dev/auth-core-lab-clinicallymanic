import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import pagination from '../../utils/pagination'
import { User } from '../user/user.model'
import {
  BannerFilterOptions,
  BannerPaginationOptions,
  CreateBannerInput,
  GetAllBannerInput,
  UpdateBannerInput,
} from './banner.interface'
import BannerModel from './banner.modal'

const createBanner = async (
  userId: string,
  payload: CreateBannerInput,
  file: Express.Multer.File
) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(404, 'User not found')
  }

  if (!file) {
    throw new AppError(400, 'Image file is required')
  }

  if (file) {
    const bannerFile = await fileUploader.uploadToCloudinary(file)
    if (!bannerFile?.url) {
      throw new AppError(500, 'Image upload failed')
    }

    payload.bannerImageUrl = bannerFile.url
    payload.bannerImagePublicId = bannerFile.publicId
  }

  const result = await new BannerModel({
    ...payload,
    createdBy: user._id,
  })

  await result.save()

  if (!result) {
    throw new AppError(500, 'Failed to create banner')
  }

  return result
}

const getBanner = async (id: string) => {
  const banner = await BannerModel.findById(id)
  if (!banner) {
    throw new AppError(404, 'Banner not found')
  }
  return banner
}

const getAllBanner = async (
  filterOptions: BannerFilterOptions,
  paginationOptions: BannerPaginationOptions
) => {
  // filtering
  const { searchTerm, ...filterData } = filterOptions

  // pagination
  const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

  const andCondition: Record<string, unknown>[] = []

  const searchableFields = ['title', 'description', 'category']
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    })
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const whereCondition = andCondition.length ? { $and: andCondition } : {}
  const sortCondition: Record<string, 1 | -1> = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
  }

  const [result, total] = await Promise.all([
    BannerModel.find(whereCondition).skip(skip).limit(limit).sort(sortCondition),
    BannerModel.countDocuments(whereCondition),
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
  const banner = await BannerModel.findById(id).select('bannerImagePublicId')
  if (!banner) {
    throw new AppError(404, 'Banner not found')
  }
  if (file && banner.bannerImagePublicId) {
    await fileUploader.deleteFromCloudinary(banner.bannerImagePublicId)
    const bannerFile = await fileUploader.uploadToCloudinary(file)
    if (!bannerFile?.url) {
      throw new AppError(500, 'Image upload failed')
    }
    updateData.bannerImageUrl = bannerFile?.url
    updateData.bannerImagePublicId = bannerFile?.publicId
  }
  const updatedBanner = await BannerModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
  return updatedBanner
}

const deleteBanner = async (id: string) => {
  const banner = await BannerModel.findById(id).select('bannerImagePublicId')
  if (!banner) {
    throw new AppError(404, 'Banner not found')
  }
  if (banner.bannerImagePublicId) {
    await fileUploader.deleteFromCloudinary(banner.bannerImagePublicId)
  }
  return await banner.deleteOne()
}

export const BannerService = {
  createBanner,
  getBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
}
