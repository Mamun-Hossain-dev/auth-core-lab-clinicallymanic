import express from 'express'
import rateLimit from 'express-rate-limit'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { userRole } from '../user/user.constants'
import { authController } from './auth.controller'
import {
  ChangePasswordZodSchema,
  ForgotPasswordZodSchema,
  LoginUserZodSchema,
  RegisterUserZodSchema,
  ResetPasswordZodSchema,
  VerifyEmailZodSchema,
} from './auth.validation'

// Stricter rate limit specifically for login — brute-force / credential stuffing prevention
// 5 attempts per 15 minutes per IP
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
})

const router = express.Router()

router.post('/register', validateRequest(RegisterUserZodSchema), authController.registerUser)
router.post('/login', loginRateLimiter, validateRequest(LoginUserZodSchema), authController.loginUser)
router.post('/refresh-token', authController.refreshToken)
router.post(
  '/forgot-password',
  validateRequest(ForgotPasswordZodSchema),
  authController.forgotPassword
)
router.post('/verify-email', validateRequest(VerifyEmailZodSchema), authController.verifyEmail)
router.post(
  '/reset-password',
  validateRequest(ResetPasswordZodSchema),
  authController.resetPassword
)
router.post(
  '/change-password',
  validateRequest(ChangePasswordZodSchema),
  auth(userRole.admin, userRole.user),
  authController.changePassword
)
router.post('/logout', authController.logoutUser)

export const authRoutes = router
