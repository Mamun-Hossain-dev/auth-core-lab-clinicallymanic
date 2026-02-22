import mongoose from 'mongoose'
import { TErrorSources, TGenericErrorResponse } from '../interface/error.interface'

const handleCastError = (error: mongoose.Error.CastError): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: error.path,
      message: `Invalid ${error.path}: ${error.value}`,
    },
  ]

  const statusCode = 400
  const message = 'Cast error occurred'

  return {
    statusCode,
    message,
    errorSources,
  }
}

export default handleCastError
