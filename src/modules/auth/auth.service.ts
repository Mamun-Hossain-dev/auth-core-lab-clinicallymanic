import { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import config from '../../config/index'
import AppError from '../../errors/AppError'
import createOtpTemplate from '../../utils/createOtpTemplate'
import { jwtHelper } from '../../utils/jwtHelper'
import { compareOtp, hashOtp } from '../../utils/otp'
import sendMailer from '../../utils/sendMailer'
import { User } from '../user/user.model'
import { LoginPayloadInput, RegisterPayloadInput } from './auth.interface'

const registerUser = async (payload: RegisterPayloadInput) => {
  const existingUser = await User.findByEmail(payload.email)

  if (existingUser) {
    throw new AppError(400, 'User with this email already exists')
  }

  const idx = Math.floor(Math.random() * 1000)
  const user = await new User({
    ...payload,
    profileImage: `https://avatar.iran.liara.run/public/${idx}.png`,
  })
  await user.save()

  return user
}

const loginUser = async (payload: LoginPayloadInput) => {
  const user = await User.findByEmail(payload.email)
  if (!user) {
    throw new AppError(401, 'Invalid email or password')
  }

  const isPasswordValid = await user.isPasswordMatched(payload.password)

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password')
  }

  if (!user.verified) {
    throw new AppError(403, 'Please verify your email to login')
  }

  const accessToken = jwtHelper.generateToken(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt.accessSecret as Secret,
    config.jwt.accessExpiresIn as SignOptions['expiresIn']
  )

  const refreshToken = jwtHelper.generateToken(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt.refreshSecret as Secret,
    config.jwt.refreshExpiresIn as SignOptions['expiresIn']
  )

  const userWithOutPassword = user.toObject()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = userWithOutPassword
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }
}

const refreshToken = async (token: string) => {
  const verifiedToken = jwtHelper.verifyToken(
    token,
    config.jwt.refreshSecret as Secret
  ) as JwtPayload

  if (!verifiedToken.userId) {
    throw new AppError(401, 'Invalid refresh token')
  }

  const user = await User.findById(verifiedToken.userId)
  if (!user) {
    throw new AppError(404, 'User not found')
  }

  const accessToken = jwtHelper.generateToken(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwt.accessSecret as Secret,
    config.jwt.accessExpiresIn as SignOptions['expiresIn']
  )

  return {
    accessToken,
  }
}

const forgotPassword = async (email: string) => {
  const user = await User.findByEmail(email)
  if (!user) {
    throw new AppError(404, 'User not found!')
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  user.otp = await hashOtp(otp)
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
  await user.save()

  await sendMailer(
    user.email,
    'Reset Password OTP',
    createOtpTemplate(otp, user.email, 'NodeExpressStarter')
  )
  return { message: 'OTP send to your email' }
}

const verifyEmail = async (email: string, otp: string) => {
  const user = await User.findByEmail(email)

  if (!user) {
    throw new AppError(404, 'User not found!')
  }

  if (!user.otp || !user.otpExpiry) {
    throw new AppError(404, 'otp not found')
  }

  if (user.otpExpiry < new Date()) {
    throw new AppError(400, 'OTP expired')
  }

  const isOtpValid = await compareOtp(otp, user.otp)

  if (!isOtpValid) {
    throw new AppError(400, 'Invalid OTP')
  }

  user.verified = true
  user.otp = undefined
  user.otpExpiry = undefined
  await user.save()
  return { message: 'Email verified successfully' }
}

const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findByEmail(email)
  if (!user) throw new AppError(404, 'User not found')

  // if (!user.verified) throw new AppError(404, 'User are not verified')

  user.password = newPassword
  user.otp = undefined
  user.otpExpiry = undefined
  await user.save()

  // Auto-login after reset
  const accessToken = jwtHelper.generateToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.accessSecret as Secret,
    config.jwt.accessExpiresIn as SignOptions['expiresIn']
  )

  const refreshToken = jwtHelper.generateToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.refreshSecret as Secret,
    config.jwt.refreshExpiresIn as SignOptions['expiresIn']
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithOutPassword } = user.toObject()
  return {
    accessToken,
    refreshToken,
    user: userWithOutPassword,
  }
}

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password')

  if (!user) throw new AppError(404, 'user not found')
  const isPasswordMatched = await user.isPasswordMatched(oldPassword)
  if (!isPasswordMatched) throw new AppError(400, 'Password not matched')

  user.password = newPassword
  await user.save()

  return { message: 'Password changed successfully' }
}

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  verifyEmail,
  resetPassword,
  changePassword,
}
