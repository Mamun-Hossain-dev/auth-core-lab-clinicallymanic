import { Types } from 'mongoose'
import z from 'zod'

export const offerBaseSchema = z.object({
    title: z.string().min(2, 'at least 2 characters'),
    description: z.string().min(5, 'at least 5 characters'),
    discount: z.coerce.number().min(0, 'must be positive'),
    validUntil: z.string().refine(val => !isNaN(Date.parse(val)), 'must be a valid date'),
    status: z.enum(['active', 'inactive']).default('active').optional(),
    thumbnail: z.string().url().optional(),
    thumbnailPublicId: z.string().optional(),
})

export const createOfferZodSchema = z.object({
    body: offerBaseSchema,
})

export const updateOfferZodSchema = z.object({
    body: offerBaseSchema.partial(),
})

export const getOfferParamZodSchema = z.object({
    params: z.object({
        id: z.string().refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId'),
    }),
})

export const getAllOfferQueryZodSchema = z.object({
    query: z.object({
        searchTerm: z.string().trim().optional(),
        status: z.enum(['active', 'inactive']).optional(),
        page: z.coerce.number().positive().optional(),
        limit: z.coerce.number().positive().max(100).optional(),
        sortBy: z.enum(['title', 'discount', 'validUntil', 'status', 'createdAt', 'updatedAt']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

export type CreateOfferInput = z.infer<typeof createOfferZodSchema>['body']
export type UpdateOfferInput = z.infer<typeof updateOfferZodSchema>['body']
export type GetAllOfferQuery = z.infer<typeof getAllOfferQueryZodSchema>['query']

export type OfferFilterOptions = Pick<GetAllOfferQuery, 'searchTerm' | 'status'>
export type OfferPaginationOptions = Pick<
    GetAllOfferQuery,
    'page' | 'limit' | 'sortBy' | 'sortOrder'
>
