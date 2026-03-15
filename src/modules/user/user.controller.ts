import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { userService } from './user.service'
import { UserFilterOptions, UserPaginationOptions } from './user.validation'

// Build HATEOAS links for a user resource
// Principle: response contains all links the client needs — no need to hard-code URLs
const buildUserLinks = (req: Request, userId: string) => {
  const base = `${req.protocol}://${String(req.get('host') ?? 'localhost')}/api/v1/users`
  return {
    self: `${base}/${userId}`,
    collection: base,
    update: `${base}/${userId}`,
    delete: `${base}/${userId}`,
  }
}

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: {
      ...result,
      links: buildUserLinks(req, String(result._id)),
    },
  })
})

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userService.getUserById(id as string)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: {
      ...result,
      links: buildUserLinks(req, String(id)),
    },
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = req.query as UserFilterOptions
  const paginationOptions = req.query as UserPaginationOptions

  const result = await userService.getAllUsers(filterOptions, paginationOptions)

  // Attach HATEOAS links to every user in the collection
  const dataWithLinks = result.data.map(user => ({
    ...user,
    links: buildUserLinks(req, String(user._id)),
  }))

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: dataWithLinks,
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
    data: {
      ...result,
      links: buildUserLinks(req, String(id)),
    },
  })
})

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  await userService.deleteUserById(id as string)
  // 204 No Content — REST standard for successful delete, no body needed
  res.status(204).send()
})

export const userController = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
}
