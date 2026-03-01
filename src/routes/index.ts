import express from 'express'
import { authRoutes } from '../modules/auth/auth.routes'
import { userRoutes } from '../modules/user/user.routes'
import { bannerRoutes } from '../modules/banner/banner.routes'
import { contactRoutes } from '../modules/contact/contact.routes'
import { eventRoutes } from '../modules/event/event.routes'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/banners',
    route: bannerRoutes,
  },
  {
    path: '/contacts',
    route: contactRoutes,
  },
  {
    path: '/events',
    route: eventRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
