import { Types } from 'mongoose'
import z from 'zod'

export const newsletterBaseSchema = z.object({
    email: z.string().email('must be a valid email'),
})

export const createNewsletterZodSchema = z.object({
    body: newsletterBaseSchema,
})

export const broadcastNewsletterZodSchema = z.object({
    body: z.object({
        subject: z.string().min(1, 'Subject is required'),
        html: z.string().min(1, 'HTML content is required'),
    }),
})

export const getNewsletterParamZodSchema = z.object({
    params: z.object({
        id: z.string().refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId'),
    }),
})

export const getAllNewsletterQueryZodSchema = z.object({
    query: z.object({
        searchTerm: z.string().trim().optional(),
        page: z.coerce.number().positive().optional(),
        limit: z.coerce.number().positive().max(100).optional(),
        sortBy: z.enum(['email', 'createdAt', 'updatedAt']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

export type CreateNewsletterInput = z.infer<typeof createNewsletterZodSchema>['body']
export type BroadcastNewsletterInput = z.infer<typeof broadcastNewsletterZodSchema>['body']
export type GetAllNewsletterQuery = z.infer<typeof getAllNewsletterQueryZodSchema>['query']

export type NewsletterFilterOptions = Pick<GetAllNewsletterQuery, 'searchTerm'>
export type NewsletterPaginationOptions = Pick<
    GetAllNewsletterQuery,
    'page' | 'limit' | 'sortBy' | 'sortOrder'
>
