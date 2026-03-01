import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { EventService } from './event.service'
import { EventFilterOptions, EventPaginationOptions } from './event.validation'

const createEvent = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const file = req.file as Express.Multer.File
    const result = await EventService.createEvent(userId as string, req.body, file)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Event created successfully',
        data: result,
    })
})

const getEventById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await EventService.getEventById(id as string)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event retrieved successfully',
        data: result,
    })
})

const getAllEvent = catchAsync(async (req: Request, res: Response) => {
    const filterOptions = req.query as EventFilterOptions
    const paginationOptions = req.query as EventPaginationOptions

    const results = await EventService.getAllEvent(filterOptions, paginationOptions)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All events retrieved successfully',
        data: results.data,
        meta: results.meta,
    })
})

const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const file = req.file as Express.Multer.File

    const result = await EventService.updateEvent(id as string, file, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event updated successfully',
        data: result,
    })
})

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await EventService.deleteEvent(id as string)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event deleted successfully',
        data: result,
    })
})

export const EventController = {
    createEvent,
    getEventById,
    getAllEvent,
    updateEvent,
    deleteEvent,
}
