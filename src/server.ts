import mongoose from 'mongoose'
import { Server } from 'http'
import app from './app'
import config from './config'
import logger from './utils/logger'

let server: Server

const main = async () => {
  try {
    await mongoose.connect(config.mongoUri)
    logger.info('Connected to the database successfully')

    server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`)
    })
  } catch (error) {
    logger.error('Failed to connect to the database', error)
    process.exit(1)
  }
}

main()

process.on('unhandledRejection', err => {
  logger.error(`Unhandled Rejection is detected, shutting down ...`, err)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
})

process.on('uncaughtException', err => {
  logger.error(`Uncaught Exception is detected, shutting down ...`, err)
  process.exit(1)
})
