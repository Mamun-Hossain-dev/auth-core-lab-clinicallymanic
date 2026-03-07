import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { contactService } from './contact.service'
import sendResponse from '../../utils/sendResponse'
import { ContactFilterOptions, ContactPaginationOptions } from './contact.validation'

const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.createContact(req.body)
  sendResponse(res, {
    statusCode: 201,
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
  const result = await contactService.updateContact(id, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  })
})

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  await contactService.deleteContact(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact deleted successfully',
    data: null,
  })
})

export const contactController = {
  createContact,
  getContactById,
  getAllContact,
  updateContact,
  deleteContact,
}
