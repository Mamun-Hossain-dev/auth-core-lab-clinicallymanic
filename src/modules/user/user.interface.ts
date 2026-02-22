import { HydratedDocument, Types } from 'mongoose'
import z from 'zod'
import { createUserZodSchema, getAllUsersZodSchema } from './user.validation'

export interface IUser {
  firstName: string
  lastName?: string
  email: string
  password: string
  role?: 'admin' | 'user' | 'guest'
  profileImage?: string
  bio?: string
  otpExpiry?: Date
  phone?: string
  location?: string
  otp?: string
  verified?: boolean
  isSubscribed?: boolean
  subscription?: Types.ObjectId
  profileImagePublicId?: string
  subscriptionExpiry?: Date | null
  // instance methods
  isPasswordMatched(givenPassword: string): Promise<boolean>
}

// Static methods interface
export interface IUserModel {
  findByEmail(email: string): Promise<HydratedDocument<IUser> | null>
}

// Additional types for create user inputs
export type CreateUserInput = z.infer<typeof createUserZodSchema>['body']

// Additional types for get all users inputs
export type GetAllUsersInput = z.infer<typeof getAllUsersZodSchema>['query']

// filter options type
export type UserFilterOptions = Pick<
  GetAllUsersInput,
  'searchTerm' | 'firstName' | 'lastName' | 'email' | 'role'
>

// pagination options type
export type UserPaginationOptions = Pick<
  GetAllUsersInput,
  'page' | 'limit' | 'sortBy' | 'sortOrder'
>
