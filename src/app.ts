import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { filterXSS } from 'xss'
import config from './config'
import globalErrorHandler from './middlewares/globalErrorHandler'
import notFound from './middlewares/notFound'
import router from './routes'

const app = express()

// ─── Security headers ───────────────────────────────────────────────────────
app.use(helmet())

// ─── CORS ────────────────────────────────────────────────────────────────────
// Development  → allow every origin (fast local iteration)
// Production   → strict whitelist from ALLOWED_ORIGINS env var
const corsOptions: CorsOptions =
  config.env === 'development'
    ? { origin: true, credentials: true } // true = echo back the request origin
    : {
      origin: (origin, callback) => {
        // Allow server-to-server requests (no origin header) and whitelisted origins
        if (!origin || config.allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('CORS policy violation: origin not allowed'))
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      exposedHeaders: ['X-RateLimit-Remaining', 'ETag'], // visible to client JS
      credentials: true,  // required when frontend sends cookies / auth headers
      maxAge: 86400,      // preflight cached for 24 h — reduces OPTIONS round trips
    }

app.use(cors(corsOptions))
// Explicitly handle preflight requests for all routes
app.options('*', cors(corsOptions))

// ─── Global rate limit (DDoS protection) ────────────────────────────────────
app.use(
  rateLimit({
    windowMs: Number(config.rateLimit.window),
    max: Number(config.rateLimit.max),
  })
)

// ─── Body parsers with size limits ──────────────────────────────────────────
app.use(express.json({ limit: '25kb' }))
app.use(express.urlencoded({ extended: true, limit: '50kb' }))

// ─── NoSQL injection prevention ─────────────────────────────────────────────
// Strips $ and . from user-supplied data to prevent MongoDB operator injection
app.use(mongoSanitize())

// ─── XSS prevention ─────────────────────────────────────────────────────────
// Sanitizes string values in req.body to strip HTML/script tags
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = JSON.parse(filterXSS(JSON.stringify(req.body)))
  }
  next()
})

// ─── Cookie parser ───────────────────────────────────────────────────────────
app.use(cookieParser(config.cookieSecret))

// ─── Application routes (centralized router) ─────────────────────────────────
app.use('/api/v1', router)

// ─── Root route ──────────────────────────────────────────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API!',
  })
})

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use(notFound)

// ─── Global error handler ────────────────────────────────────────────────────
app.use(globalErrorHandler)

export default app
