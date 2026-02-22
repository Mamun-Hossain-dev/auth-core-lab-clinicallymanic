import { model, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import config from '../../config'
import { IUser, IUserModel } from './user.interface'

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guest'],
      default: 'user',
    },
    profileImage: { type: String },
    profileImagePublicId: { type: String },
    bio: { type: String },
    phone: { type: String },
    location: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    verified: {
      type: Boolean,
      default: true,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(config.bcryptSaltRounds))
  }
})

userSchema.methods.isPasswordMatched = async function (givenPassword: string): Promise<boolean> {
  return await bcrypt.compare(givenPassword, this.password)
}

// Static method to find user by email
userSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password')
}

export const User = model<IUser, Model<IUser> & IUserModel>('User', userSchema)
