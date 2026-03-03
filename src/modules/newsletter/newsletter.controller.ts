import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { NewsletterService } from './newsletter.service'
import { NewsletterFilterOptions, NewsletterPaginationOptions } from './newsletter.validation'

const createNewsletter = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterService.createNewsletter(req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Subscribed to newsletter successfully',
        data: result,
    })
})

const getAllNewsletter = catchAsync(async (req: Request, res: Response) => {
    const filterOptions = req.query as NewsletterFilterOptions
    const paginationOptions = req.query as NewsletterPaginationOptions

    const results = await NewsletterService.getAllNewsletter(filterOptions, paginationOptions)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All newsletter subscribers retrieved successfully',
        data: results.data,
        meta: results.meta,
    })
})

const getSingleNewsletter = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const result = await NewsletterService.getSingleNewsletter(id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Newsletter subscription retrieved successfully',
        data: result,
    })
})

const deleteNewsletter = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const result = await NewsletterService.deleteNewsletter(id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Newsletter subscription deleted successfully',
        data: result,
    })
})

const broadcastNewsletter = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterService.broadcastNewsletter(req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Newsletter broadcasted successfully',
        data: result,
    })
})

export const NewsletterController = {
    createNewsletter,
    getAllNewsletter,
    getSingleNewsletter,
    deleteNewsletter,
    broadcastNewsletter,
}
