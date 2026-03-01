import { Types } from 'mongoose'
import z from 'zod'

export const bannerBaseSchema = z.object({
  title: z.string().min(2, 'at least 2 characters'),
  description: z.string().min(5, 'at least 5 characters'),
  category: z.string().min(2, 'at least 2 characters'),
  status: z.enum(['active', 'inactive']).default('inactive').optional(),
  bannerImageUrl: z.string().url().optional(),
  bannerImagePublicId: z.string().optional(),
})

export const createBannerZodSchema = z.object({
  body: bannerBaseSchema,
})

export const updateBannerZodSchema = z.object({
  body: bannerBaseSchema
    .pick({
      title: true,
      description: true,
      category: true,
      status: true,
      bannerImageUrl: true,
      bannerImagePublicId: true,
    })
    .partial(),
})

export const getBannerParamZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId'),
  }),
})

export const getAllBannerQueryZodSchema = z.object({
  query: z.object({
    // filtering
    searchTerm: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.enum(['active', 'inactive']).optional(),

    // pagination
    page: z.coerce.number().positive().optional(),
    limit: z.coerce.number().positive().max(100).optional(),

    // sorting
    sortBy: z.enum(['title', 'category', 'status', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
})

export type CreateBannerInput = z.infer<typeof createBannerZodSchema>['body']
export type UpdateBannerInput = z.infer<typeof updateBannerZodSchema>['body']
export type GetAllBannerQuery = z.infer<typeof getAllBannerQueryZodSchema>['query']

export type BannerFilterOptions = Pick<GetAllBannerQuery, 'searchTerm' | 'category' | 'status'>
export type BannerPaginationOptions = Pick<
  GetAllBannerQuery,
  'page' | 'limit' | 'sortBy' | 'sortOrder'
>
