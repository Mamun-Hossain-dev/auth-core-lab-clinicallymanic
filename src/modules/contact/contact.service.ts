import ContactModel from './contact.modal'
import AppError from '../../errors/AppError'
import pagination from '../../utils/pagination'
import {
  ContactFilterOptions,
  ContactPaginationOptions,
  CreateContactInput,
  UpdateContactInput,
} from './contact.validation'

const createContact = async (data: CreateContactInput) => {
  const result = await ContactModel.create(data)
  return result
}

const getContactById = async (id: string) => {
  const result = await ContactModel.findById(id).lean()
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
    ContactModel.find(whereCondition)
      .sort(sortCondition)
      .skip(skip as number)
      .limit(limit as number)
      .lean(),

    ContactModel.countDocuments(whereCondition),
  ])

  return {
    meta: { page, limit, total },
    data: contacts,
  }
}

const updateContact = async (id: string, data: UpdateContactInput) => {
  const updated = await ContactModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean()

  if (!updated) {
    throw new AppError(404, 'Contact not found')
  }

  return updated
}

const deleteContact = async (id: string) => {
  const deleted = await ContactModel.findByIdAndDelete(id).lean()
  if (!deleted) {
    throw new AppError(404, 'Contact not found')
  }
  return deleted
}

export const contactService = {
  createContact,
  getContactById,
  getAllContact,
  updateContact,
  deleteContact,
}
