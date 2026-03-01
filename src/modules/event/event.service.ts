import { Types } from 'mongoose'
import AppError from '../../errors/AppError'
import { fileUploader } from '../../utils/fileUpload'
import pagination from '../../utils/pagination'
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
    const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

    const andConditions: Record<string, unknown>[] = []

    if (searchTerm) {
        const searchableFields = ['title', 'description', 'location']
        andConditions.push({
            $or: searchableFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            })),
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        })
    }

    if (startDate || endDate) {
        const dateCondition: Record<string, any> = {}
        if (startDate) dateCondition.$gte = startDate
        if (endDate) dateCondition.$lte = endDate
        andConditions.push({ date: dateCondition })
    }

    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {}

    const sortCondition: Record<string, 1 | -1> = {}
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
    }

    const [result, total] = await Promise.all([
        EventModel.find(whereCondition)
            .sort(sortCondition)
            .skip(skip as number)
            .limit(limit as number)
            .lean(),
        EventModel.countDocuments(whereCondition),
    ])

    return {
        data: result,
        meta: { page, limit, total },
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
