import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OfferService } from './offer.service'
import { OfferFilterOptions, OfferPaginationOptions } from './offer.validation'

const createOffer = catchAsync(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File
    const result = await OfferService.createOffer(req.body, file)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Offer created successfully',
        data: result,
    })
})

const getOffer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const result = await OfferService.getOffer(id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Offer retrieved successfully',
        data: result,
    })
})

const getAllOffers = catchAsync(async (req: Request, res: Response) => {
    const filterOptions = req.query as OfferFilterOptions
    const paginationOptions = req.query as OfferPaginationOptions

    const results = await OfferService.getAllOffers(filterOptions, paginationOptions)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All offers retrieved successfully',
        data: results.data,
        meta: results.meta,
    })
})

const updateOffer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const file = req.file as Express.Multer.File

    const result = await OfferService.updateOffer(id, file, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Offer updated successfully',
        data: result,
    })
})

const deleteOffer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    await OfferService.deleteOffer(id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Offer deleted successfully',
        data: null,
    })
})

export const OfferController = {
    createOffer,
    getOffer,
    getAllOffers,
    updateOffer,
    deleteOffer,
}
