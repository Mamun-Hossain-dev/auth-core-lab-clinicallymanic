import ContactModel from './contact.modal'
import AppError from '../../errors/AppError'
import queryHelper from '../../utils/queryHelper'
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
  const { modelQuery, getMeta } = queryHelper(
    ContactModel.find(),
    { ...filterOptions, ...paginationOptions },
    {
      searchableFields: ['name', 'email', 'phoneNumber', 'occupation', 'subject', 'message'],
    }
  )

  const result = await modelQuery.lean()
  const meta = await getMeta()

  return {
    data: result,
    meta,
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
