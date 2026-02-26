import z from 'zod'
import { ContactCreateSchema, ContactGetAllSchema, ContactUpdateSchema } from './contact.validation'

export interface IContact {
  name: string
  email: string
  phoneNumber: string
  occupation: string
  subject: string
  message: string
  isRead: boolean
}

export type CreateContactInput = z.infer<typeof ContactCreateSchema>['body']
export type UpdateContactInput = z.infer<typeof ContactUpdateSchema>['body']
export type GetAllContactInput = z.infer<typeof ContactGetAllSchema>['query']
export type ContactFilterOptions = Pick<
  GetAllContactInput,
  'searchTerm' | 'name' | 'email' | 'isRead'
>
export type ContactPaginationOptions = Pick<
  GetAllContactInput,
  'page' | 'limit' | 'sortBy' | 'sortOrder'
>
