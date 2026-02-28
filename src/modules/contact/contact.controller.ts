import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { contactService } from './contact.service'
import sendResponse from '../../utils/sendResponse'
import {
  ContactFilterOptions,
  ContactPaginationOptions,
  UpdateContactInput,
} from './contact.interface'

const createContact = catchAsync(async (req: Request, res: Response) => {
  const data = req.body
  const result = await contactService.createContact(data)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact created successfully',
    data: result,
  })
})

const getContactById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const result = await contactService.getContactById(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact retrieved successfully',
    data: result,
  })
})

const getAllContact = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = req.query as ContactFilterOptions
  const paginationOptions = req.query as ContactPaginationOptions
  // const result = await contactService.getAllContactWithCursor(filterOptions, paginationOptions)
  // sendResponse(res, {
  //   statusCode: 200,
  //   success: true,
  //   message: 'Contacts retrieved successfully',
  //   meta: {
  //     limit: result.metaData.limit,
  //     nextCursor: result.metaData?.nextCursor?.toString(),
  //     prevCursor: result.metaData?.prevCursor?.toString(),
  //     hasNextPage: !!result.metaData?.nextCursor,
  //     hasPrevPage: !!result.metaData?.prevCursor,
  //   },
  //   data: result.data,
  // })

  const result = await contactService.getAllContact(filterOptions, paginationOptions)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const data = req.body as UpdateContactInput
  const result = await contactService.updateContact(id, data)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  })
})

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const result = await contactService.deleteContact(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  })
})

export const contactController = {
  createContact,
  getContactById,
  getAllContact,
  updateContact,
  deleteContact,
}
