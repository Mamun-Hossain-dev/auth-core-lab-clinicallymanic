import { Types } from 'mongoose'
import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import queryHelper from '../../utils/queryHelper'
import EventModel from './event.model'
import {
    CreateEventInput,
    EventFilterOptions,
    EventPaginationOptions,
    UpdateEventInput,
} from './event.validation'

const createEvent = async (userId: string, payload: CreateEventInput, file: Express.Multer.File) => {
    if (!file) {
        throw new AppError(400, 'Thumbnail image file is required')
    }

    const thumbnailFile = await fileUploader.uploadToCloudinary(file)
    if (!thumbnailFile?.url) {
        throw new AppError(500, 'Image upload failed')
    }

    const result = await EventModel.create({
        ...payload,
        thumbnail: thumbnailFile.url,
        thumbnailPublicId: thumbnailFile.publicId,
        createdBy: new Types.ObjectId(userId),
    })

    return result
}

const getEventById = async (id: string) => {
    const event = await EventModel.findById(id).lean()
    if (!event) {
        throw new AppError(404, 'Event not found')
    }
    return event
}

const getAllEvent = async (
    filterOptions: EventFilterOptions,
    paginationOptions: EventPaginationOptions
) => {
    const { searchTerm, startDate, endDate, ...filterData } = filterOptions

    const { modelQuery, getMeta } = queryHelper(
        EventModel.find(),
        { ...filterData, ...paginationOptions, searchTerm },
        { searchableFields: ['title', 'description', 'location'] }
    )

    if (startDate || endDate) {
        const dateCondition: Record<string, any> = {}
        if (startDate) dateCondition.$gte = startDate
        if (endDate) dateCondition.$lte = endDate
        modelQuery.find({ date: dateCondition })
    }

    const result = await modelQuery.lean()
    const meta = await getMeta()

    return {
        data: result,
        meta,
    }
}

const updateEvent = async (id: string, file: Express.Multer.File, updateData: UpdateEventInput) => {
    const event = await EventModel.findById(id).select('thumbnailPublicId').lean()
    if (!event) {
        throw new AppError(404, 'Event not found')
    }

    let finalUpdateData = { ...updateData } as any

    if (file) {
        if (event.thumbnailPublicId) {
            await fileUploader.deleteFromCloudinary(event.thumbnailPublicId)
        }

        const thumbnailFile = await fileUploader.uploadToCloudinary(file)
        if (!thumbnailFile?.url) {
            throw new AppError(500, 'Image upload failed')
        }
        finalUpdateData.thumbnail = thumbnailFile.url
        finalUpdateData.thumbnailPublicId = thumbnailFile.publicId
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(id, finalUpdateData, {
        new: true,
        runValidators: true,
    }).lean()

    return updatedEvent
}

const deleteEvent = async (id: string) => {
    const event = await EventModel.findById(id).select('thumbnailPublicId').lean()
    if (!event) {
        throw new AppError(404, 'Event not found')
    }

    if (event.thumbnailPublicId) {
        await fileUploader.deleteFromCloudinary(event.thumbnailPublicId)
    }

    return await EventModel.findByIdAndDelete(id).lean()
}

export const EventService = {
    createEvent,
    getEventById,
    getAllEvent,
    updateEvent,
    deleteEvent,
}
