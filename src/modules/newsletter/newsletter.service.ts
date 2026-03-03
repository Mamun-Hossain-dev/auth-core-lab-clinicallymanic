import AppError from '../../errors/AppError'
import sendMailer from '../../utils/sendMailer'
import NewsletterModel from './newsletter.model'
import {
  BroadcastNewsletterInput,
  NewsletterFilterOptions,
  NewsletterPaginationOptions,
} from './newsletter.validation'
import queryHelper from '../../utils/queryHelper'

const createNewsletter = async (payload: { email: string }) => {
  const isExist = await NewsletterModel.findOne({ email: payload.email }).lean()
  if (isExist) {
    throw new AppError(400, 'Email already subscribed')
  }
  const result = await NewsletterModel.create(payload)
  return result
}

const getAllNewsletter = async (
  filterOptions: NewsletterFilterOptions,
  paginationOptions: NewsletterPaginationOptions
) => {
  const { modelQuery, getMeta } = queryHelper(
    NewsletterModel.find(),
    { ...filterOptions, ...paginationOptions },
    { searchableFields: ['email'] }
  )

  const result = await modelQuery.lean()
  const meta = await getMeta()

  return {
    data: result,
    meta,
  }
}

const getSingleNewsletter = async (id: string) => {
  const result = await NewsletterModel.findById(id).lean()
  if (!result) {
    throw new AppError(404, 'Newsletter subscription not found')
  }
  return result
}

const deleteNewsletter = async (id: string) => {
  const result = await NewsletterModel.findByIdAndDelete(id).lean()
  if (!result) {
    throw new AppError(404, 'Newsletter subscription not found')
  }
  return result
}

const broadcastNewsletter = async (payload: BroadcastNewsletterInput) => {
  const { subject, html } = payload

  const subscribers = await NewsletterModel.find().select('email').lean()
  if (!subscribers.length) {
    throw new AppError(404, 'No newsletter subscribers found')
  }

  // Use Promise.allSettled to continue even if some emails fail
  const results = await Promise.allSettled(
    subscribers.map(sub => sendMailer(sub.email, subject, html))
  )

  const successCount = results.filter(r => r.status === 'fulfilled').length
  const failCount = results.filter(r => r.status === 'rejected').length

  return {
    total: subscribers.length,
    successCount,
    failCount,
  }
}

export const NewsletterService = {
  createNewsletter,
  getAllNewsletter,
  getSingleNewsletter,
  deleteNewsletter,
  broadcastNewsletter,
}
