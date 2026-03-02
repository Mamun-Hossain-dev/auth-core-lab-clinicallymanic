import { HydratedDocument, Types } from 'mongoose'

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
