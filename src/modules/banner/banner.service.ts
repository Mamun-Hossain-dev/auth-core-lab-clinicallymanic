import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import { User } from '../user/user.model'
import { CreateBannerInput } from './banner.interface'
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

export const BannerService = {
  createBanner,
}
