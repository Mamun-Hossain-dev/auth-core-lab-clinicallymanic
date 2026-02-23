import { Types } from 'mongoose'
import z from 'zod'
import {
  createBannerZodSchema,
  getAllBannerQueryZodSchema,
  updateBannerZodSchema,
} from './banner.validation'

export interface Banner {
  title: string
  description: string
  bannerImageUrl: string
  bannerImagePublicId: string
  category: string
  status?: 'active' | 'inactive'
  createdBy?: Types.ObjectId
}

export type CreateBannerInput = z.infer<typeof createBannerZodSchema>['body']
export type UpdateBannerInput = z.infer<typeof updateBannerZodSchema>['body']
export type GetAllBannerInput = z.infer<typeof getAllBannerQueryZodSchema>['query']
