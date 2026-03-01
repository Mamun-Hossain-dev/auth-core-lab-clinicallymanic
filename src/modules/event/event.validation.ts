import { Types } from 'mongoose'
import z from 'zod'

export const eventBaseSchema = z.object({
    title: z.string().min(2, 'at least 2 characters'),
    description: z.string().min(5, 'at least 5 characters'),
    location: z.string().min(2, 'at least 2 characters'),
    date: z.coerce.date(),
    thumbnail: z.string().url().optional(),
    thumbnailPublicId: z.string().optional(),
})

export const createEventZodSchema = z.object({
    body: eventBaseSchema,
})

export const updateEventZodSchema = z.object({
    body: eventBaseSchema.partial(),
})

export const getEventParamZodSchema = z.object({
    params: z.object({
        id: z.string().refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId'),
    }),
})

export const getAllEventQueryZodSchema = z.object({
    query: z.object({
        // filtering
        searchTerm: z.string().trim().optional(),
        location: z.string().trim().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),

        // pagination
        page: z.coerce.number().positive().optional(),
        limit: z.coerce.number().positive().max(100).optional(),

        // sorting
        sortBy: z.enum(['title', 'location', 'date', 'createdAt', 'updatedAt']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

export type CreateEventInput = z.infer<typeof createEventZodSchema>['body']
export type UpdateEventInput = z.infer<typeof updateEventZodSchema>['body']
export type GetAllEventQuery = z.infer<typeof getAllEventQueryZodSchema>['query']

export type EventFilterOptions = Pick<
    GetAllEventQuery,
    'searchTerm' | 'location' | 'startDate' | 'endDate'
>
export type EventPaginationOptions = Pick<
    GetAllEventQuery,
    'page' | 'limit' | 'sortBy' | 'sortOrder'
>
