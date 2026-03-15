import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import {
  CreateUserInput,
  UpdateUserInput,
  UserFilterOptions,
  UserPaginationOptions,
} from './user.validation'
import { User } from './user.model'
import queryHelper from '../../utils/queryHelper'

const createUser = async (payload: CreateUserInput) => {
  const result = await User.create(payload)
  return result
}

const getUserById = async (id: string) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).lean()
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  return user
}

const getAllUsers = async (
  filterOptions: UserFilterOptions,
  paginationOptions: UserPaginationOptions
) => {
  const { modelQuery, getMeta } = queryHelper(
    User.find({ isDeleted: false }),
    { ...filterOptions, ...paginationOptions },
    { useTextSearch: true }
  )

  const result = await modelQuery.lean()
  const meta = await getMeta()

  // Empty list is a valid 200 — no 404 needed
  return {
    data: result,
    meta,
  }
}

const updateUserById = async (
  id: string,
  updateData: UpdateUserInput,
  file?: Express.Multer.File
) => {
  const existingUser = await User.findOne({ _id: id, isDeleted: false })
    .select('profileImage profileImagePublicId')
    .lean()
  if (!existingUser) {
    throw new AppError(404, 'User not found')
  }

  let finalUpdateData = { ...updateData }

  if (file) {
    const uploadedImage = await fileUploader.uploadToCloudinary(file)

    if (!uploadedImage?.url) {
      throw new AppError(500, 'Image upload failed')
    }

    finalUpdateData.profileImage = uploadedImage.url
    finalUpdateData.profileImagePublicId = uploadedImage.publicId

    // Delete old image from Cloudinary
    if (existingUser.profileImagePublicId) {
      await fileUploader.deleteFromCloudinary(existingUser.profileImagePublicId)
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, finalUpdateData, {
    new: true,
    runValidators: true,
  }).lean()

  return updatedUser
}

// Soft delete — mark isDeleted:true, keep profile image in Cloudinary
const deleteUserById = async (id: string) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).lean()
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  await User.findByIdAndUpdate(id, { isDeleted: true })
}

export const userService = {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
}
