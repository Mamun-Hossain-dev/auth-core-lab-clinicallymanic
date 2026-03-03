import AppError from '../../errors/AppError'
import pagination from '../../utils/pagination'
import sendMailer from '../../utils/sendMailer'
import NewsletterModel from './newsletter.model'
import {
  BroadcastNewsletterInput,
  NewsletterFilterOptions,
  NewsletterPaginationOptions,
} from './newsletter.validation'

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
  const { searchTerm } = filterOptions
  const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

  const query: Record<string, any> = {}

  if (searchTerm) {
    query.email = { $regex: searchTerm, $options: 'i' }
  }

  const sortCondition: Record<string, 1 | -1> = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
  }

  const [result, total] = await Promise.all([
    NewsletterModel.find(query).sort(sortCondition).skip(skip).limit(limit).lean(),
    NewsletterModel.countDocuments(query),
  ])

  return {
    data: result,
    meta: { page, limit, total },
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
