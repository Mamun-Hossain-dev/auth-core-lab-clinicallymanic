import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import pagination from '../../utils/pagination'
import { CreateUserInput, UserFilterOptions, UserPaginationOptions } from './user.interface'
import { User } from './user.model'

const createUser = async (payload: Partial<CreateUserInput>) => {
  const user = await new User(payload)
  return user.save()
}

const getUserById = async (id: string) => {
  const user = await User.findById(id)
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
  const searchFields = ['firstName', 'lastName', 'email', 'role']

  if (searchTerm) {
    andCondition.push({
      $or: searchFields.map(field => ({
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

  const [users, total] = await Promise.all([
    User.find(whereCondition)
      .skip(skip as number)
      .limit(limit as number)
      .sort(sortCondition),

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
  updateData: Partial<CreateUserInput>,
  file?: Express.Multer.File
) => {
  const existingUser = await User.findById(id).select('profileImage profileImagePublicId')
  if (!existingUser) {
    throw new AppError(404, 'User not found')
  }

  if (file) {
    const uploadedImage = await fileUploader.uploadToCloudinary(file)

    if (!uploadedImage?.url) {
      throw new AppError(500, 'Image upload failed')
    }

    updateData.profileImage = uploadedImage.url
    updateData.profileImagePublicId = uploadedImage.publicId

    // Delete old image from Cloudinary
    if (existingUser.profileImagePublicId) {
      await fileUploader.deleteFromCloudinary(existingUser.profileImagePublicId)
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  return updatedUser
}

const deleteUserById = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  return await user.deleteOne()
}

export const userService = {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
}
