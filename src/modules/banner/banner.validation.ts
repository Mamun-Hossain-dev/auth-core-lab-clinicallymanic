import { fileUploader } from './../../utils/fileUpload'
import { Types } from 'mongoose'
import z from 'zod'

export const bannerBaseSchema = z.object({
  title: z.string().min(2, 'at least 2 characters'),
  description: z.string().min(5, 'at least 5 characters'),
  bannerImageUrl: z.string().url().optional(),
  bannerImagePublicId: z.string().optional(),
  category: z.string().min(2, 'at least 2 characters'),
  status: z.enum(['active', 'inactive']).default('inactive').optional(),
  createdBy: z
    .string()
    .refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId')
    .optional(),
})

export const createBannerZodSchema = z.object({
  body: bannerBaseSchema.partial(),
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
