import { NextFunction, Request, Response } from 'express'
import { ZodTypeAny } from 'zod'
import catchAsync from '../utils/catchAsync'

const validateRequest = (schema: ZodTypeAny) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    })

    // Assign validated and coerced data back to request
    // This ensures that transformed values (like coerced numbers) are available in the controller
    req.body = (parsed as any).body
    req.query = (parsed as any).query
    req.params = (parsed as any).params
    req.cookies = (parsed as any).cookies

    next()
  })
}

export default validateRequest
