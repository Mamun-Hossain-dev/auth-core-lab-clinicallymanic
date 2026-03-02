import AppError from '../errors/AppError'
import catchAsync from '../utils/catchAsync'

const parseData = catchAsync(async (req, res, next) => {
  if (req.body?.data && typeof req.body.data === 'string') {
    try {
      req.body = JSON.parse(req.body.data)
    } catch (error) {
      return next(new AppError(400, 'Invalid JSON format in data field'))
    }
  }
  next()
})

export default parseData
