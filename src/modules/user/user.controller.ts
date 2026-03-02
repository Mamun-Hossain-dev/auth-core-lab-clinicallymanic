import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { userService } from './user.service'
import { UserFilterOptions, UserPaginationOptions } from './user.validation'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: result,
  })
})

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userService.getUserById(id as string)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = req.query as UserFilterOptions
  const paginationOptions = req.query as UserPaginationOptions

  const result = await userService.getAllUsers(filterOptions, paginationOptions)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const file = req.file as Express.Multer.File

  const result = await userService.updateUserById(id as string, req.body, file)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  })
})

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const result = await userService.deleteUserById(id as string)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  })
})

export const userController = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
}
