import Contact from './contact.modal'
import AppError from '../../errors/AppError'
import pagination from '../../utils/pagination'
import cursorPagination from '../../utils/cursorPagination'
import {
  ContactFilterOptions,
  ContactPaginationOptions,
  CreateContactInput,
  UpdateContactInput,
} from './contact.validation'

const createContact = async (data: CreateContactInput) => {
  const result = await Contact.create(data)
  return result
}

const getContactById = async (id: string) => {
  const result = await Contact.findById(id).lean()
  if (!result) {
    throw new AppError(404, 'Contact not found')
  }
  return result
}

const getAllContact = async (
  filterOptions: ContactFilterOptions,
  paginationOptions: ContactPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterOptions
  const { page, limit, skip, sortBy, sortOrder } = pagination(paginationOptions)

  const andConditions: Record<string, unknown>[] = []

  const searchableFields = ['name', 'email', 'phoneNumber', 'occupation', 'subject', 'message']
  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    })
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const whereCondition = andConditions.length ? { $and: andConditions } : {}

  const sortCondition: Record<string, 1 | -1> = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
  }

  const [contacts, total] = await Promise.all([
    Contact.find(whereCondition)
      .sort(sortCondition)
      .skip(skip as number)
      .limit(limit as number)
      .lean(),

    Contact.countDocuments(whereCondition),
  ])

  if (!contacts.length) {
    throw new AppError(404, 'No contacts found')
  }

  return {
    meta: {
      page: page,
      limit: limit,
      total,
    },
    data: contacts,
  }
}

// const getAllContactWithCursor = async (filterOptions: ContactFilterOptions, cursorOptions: any) => {
//   const { searchTerm, ...filterData } = filterOptions
//   const { limit, cursor, direction } = cursorPagination(cursorOptions)

//   const andConditions: Record<string, unknown>[] = []

//   const searchableFields = ['name', 'email', 'phoneNumber', 'occupation', 'subject', 'message']
//   if (searchTerm) {
//     andConditions.push({
//       $or: searchableFields.map(field => ({
//         [field]: { $regex: searchTerm, $options: 'i' },
//       })),
//     })
//   }

//   if (Object.keys(filterData).length) {
//     andConditions.push({
//       $and: Object.entries(filterData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     })
//   }

//   // cursor-based pagination logic
//   if (cursor) {
//     if (direction === 'next') {
//       andConditions.push({ _id: { $lt: cursor } })
//     } else {
//       andConditions.push({ _id: { $gt: cursor } })
//     }
//   }

//   const whereCondition = andConditions.length ? { $and: andConditions } : {}

//   let contacts = await Contact.find(whereCondition)
//     .sort({ _id: direction === 'next' ? -1 : 1 })
//     .limit(limit)

//   if (direction === 'prev') {
//     contacts = contacts.reverse()
//   }

//   if (!contacts.length) {
//     throw new AppError(404, 'No contacts found')
//   }

//   return {
//     metaData: {
//       limit,
//       nextCursor: contacts[contacts.length - 1]?._id,
//       prevCursor: contacts[0]?._id,
//     },
//     data: contacts,
//   }
// }

const updateContact = async (id: string, data: UpdateContactInput) => {
  const contact = await Contact.findById(id)
  if (!contact) {
    throw new AppError(404, 'Contact not found')
  }
  if (data.isRead !== undefined) {
    contact.isRead = data.isRead
  }
  await contact.save()
  return contact
}

const deleteContact = async (id: string) => {
  const contact = await Contact.findById(id)
  if (!contact) {
    throw new AppError(404, 'Contact not found')
  }
  await contact.deleteOne()
  return contact
}

export const contactService = {
  createContact,
  getContactById,
  getAllContact,
  // getAllContactWithCursor,
  updateContact,
  deleteContact,
}
