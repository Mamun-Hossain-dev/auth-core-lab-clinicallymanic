import { Types } from 'mongoose'
import z from 'zod'

export const ContactBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  isRead: z.boolean().default(false),
})

export const ContactCreateSchema = z.object({
  body: ContactBaseSchema,
})

export const ContactGetByIdSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId'),
  }),
})

export const ContactGetAllSchema = z.object({
  query: z.object({
    searchTerm: z.string().trim().optional(),
    name: z.string().trim().optional(),
    email: z.string().email().optional(),
    isRead: z.coerce.boolean().optional(),

    page: z.coerce.number().positive().optional(),
    limit: z.coerce.number().positive().max(100).optional(),
    sortBy: z.enum(['name', 'email', 'isRead', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
})

export const ContactUpdateSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), 'must be a valid MongoDB ObjectId'),
  }),
  body: z.object({
    isRead: z.boolean().optional(),
  }),
})
