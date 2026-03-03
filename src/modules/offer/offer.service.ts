import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import pagination from '../../utils/pagination'
import OfferModel from './offer.model'
import {
  CreateOfferInput,
  OfferFilterOptions,
  OfferPaginationOptions,
  UpdateOfferInput,
} from './offer.validation'

const createOffer = async (payload: CreateOfferInput, file?: Express.Multer.File) => {
  let thumbnail = payload.thumbnail
  let thumbnailPublicId = payload.thumbnailPublicId

  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file)
    if (!uploadedFile?.url) {
      throw new AppError(500, 'Image upload failed')
    }
    thumbnail = uploadedFile.url
    thumbnailPublicId = uploadedFile.publicId
  }

  const result = await OfferModel.create({
    ...payload,
    thumbnail,
    thumbnailPublicId,
  })

  return result
}

const getOffer = async (id: string) => {
  const result = await OfferModel.findById(id).lean()
  if (!result) {
    throw new AppError(404, 'Offer not found')
  }
  return result
}

const getAllOffers = async (
  filterOptions: OfferFilterOptions,
  paginationOptions: OfferPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterOptions
  const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

  const query: Record<string, any> = {}

  if (searchTerm) {
    const searchableFields = ['title', 'description']
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
    OfferModel.find(query).sort(sortCondition).skip(skip).limit(limit).lean(),
    OfferModel.countDocuments(query),
  ])

  return {
    data: result,
    meta: { page, limit, total },
  }
}

const updateOffer = async (id: string, file: Express.Multer.File, payload: UpdateOfferInput) => {
  const offer = await OfferModel.findById(id).select('thumbnailPublicId').lean()
  if (!offer) {
    throw new AppError(404, 'Offer not found')
  }

  const updateData = { ...payload }

  if (file) {
    if (offer.thumbnailPublicId) {
      await fileUploader.deleteFromCloudinary(offer.thumbnailPublicId)
    }

    const uploadedFile = await fileUploader.uploadToCloudinary(file)
    if (!uploadedFile?.url) {
      throw new AppError(500, 'Image upload failed')
    }
    updateData.thumbnail = uploadedFile.url
    updateData.thumbnailPublicId = uploadedFile.publicId
  }

  const result = await OfferModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean()

  return result
}

const deleteOffer = async (id: string) => {
  const offer = await OfferModel.findById(id).select('thumbnailPublicId').lean()
  if (!offer) {
    throw new AppError(404, 'Offer not found')
  }

  if (offer.thumbnailPublicId) {
    await fileUploader.deleteFromCloudinary(offer.thumbnailPublicId)
  }

  const result = await OfferModel.findByIdAndDelete(id).lean()
  return result
}

export const OfferService = {
  createOffer,
  getOffer,
  getAllOffers,
  updateOffer,
  deleteOffer,
}
