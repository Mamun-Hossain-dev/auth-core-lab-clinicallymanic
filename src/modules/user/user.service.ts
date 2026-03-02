import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import pagination from '../../utils/pagination'
import {
  CreateUserInput,
  UpdateUserInput,
  UserFilterOptions,
  UserPaginationOptions,
} from './user.validation'
import { User } from './user.model'

const createUser = async (payload: CreateUserInput) => {
  const result = await User.create(payload)
  return result
}

const getUserById = async (id: string) => {
  const user = await User.findById(id).lean()
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  return user
}

const getAllUsers = async (
  filterOptions: UserFilterOptions,
  paginationOptions: UserPaginationOptions
) => {
  // filtering
  const { searchTerm, ...filterData } = filterOptions

  // pagination
  const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

  const andCondition: Record<string, unknown>[] = []

  if (searchTerm) {
    andCondition.push({
      $text: { $search: searchTerm },
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

  if (searchTerm) {
    sortCondition.score = { $meta: 'textScore' } as any
  } else if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
  }

  const [users, total] = await Promise.all([
    User.find(whereCondition)
      .sort(sortCondition)
      .skip(skip as number)
      .limit(limit as number)
      .lean(),

    User.countDocuments(whereCondition),
  ])

  if (users.length === 0) {
    throw new AppError(404, 'No users found')
  }

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
    },
  }
}

const updateUserById = async (
  id: string,
  updateData: UpdateUserInput,
  file?: Express.Multer.File
) => {
  const existingUser = await User.findById(id).select('profileImage profileImagePublicId').lean()
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

const deleteUserById = async (id: string) => {
  const user = await User.findById(id).select('profileImagePublicId').lean()
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  if (user.profileImagePublicId) {
    await fileUploader.deleteFromCloudinary(user.profileImagePublicId)
  }
  return await User.findByIdAndDelete(id).lean()
}

export const userService = {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
}
