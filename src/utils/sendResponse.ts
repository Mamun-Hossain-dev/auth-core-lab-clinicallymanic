import { Response } from 'express'

type OffSetMeta = {
  page: number
  limit: number
  total: number
}

type CursorMeta = {
  limit: number
  nextCursor?: string
  prevCursor?: string
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

type TResponse<T> = {
  statusCode: number
  success: boolean
  message?: string
  meta?: OffSetMeta | CursorMeta
  data?: T
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  })
}

export default sendResponse
