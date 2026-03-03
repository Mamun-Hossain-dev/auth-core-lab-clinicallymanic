import { Query } from 'mongoose'

type TQueryObj = {
    searchTerm?: string
    page?: string | number
    limit?: string | number
    sortBy?: string
    sortOrder?: string
    fields?: string
    [key: string]: unknown
}

const queryHelper = <T>(
    modelQuery: Query<T[], T>,
    query: TQueryObj,
    options: {
        searchableFields?: string[]
        useTextSearch?: boolean
    } = {}
) => {
    const { searchableFields = [], useTextSearch = false } = options
    let modifiedQuery = modelQuery

    // Search
    const searchTerm = query?.searchTerm
    if (searchTerm) {
        if (useTextSearch) {
            modifiedQuery = modifiedQuery.find({
                $text: { $search: searchTerm },
            } as any)
        } else if (searchableFields.length > 0) {
            modifiedQuery = modifiedQuery.find({
                $or: searchableFields.map(
                    field =>
                    ({
                        [field]: { $regex: searchTerm, $options: 'i' },
                    })
                ),
            } as any)
        }
    }

    // Filter
    const queryObj = { ...query }
    const excludeFields = ['searchTerm', 'sortBy', 'sortOrder', 'limit', 'page', 'fields']
    excludeFields.forEach(el => delete queryObj[el])

    if (Object.keys(queryObj).length > 0) {
        modifiedQuery = modifiedQuery.find(queryObj as any)
    }

    // Sort
    const sortBy = (query?.sortBy as string) || 'createdAt'
    const sortOrder = (query?.sortOrder as string) === 'asc' ? '' : '-'

    if (useTextSearch && searchTerm) {
        modifiedQuery = modifiedQuery.sort({ score: { $meta: 'textScore' } } as any)
    } else {
        modifiedQuery = modifiedQuery.sort(`${sortOrder}${sortBy}`)
    }

    // Paginate
    const page = Number(query?.page) || 1
    const limit = Number(query?.limit) || 10
    const skip = (page - 1) * limit
    modifiedQuery = modifiedQuery.skip(skip).limit(limit)

    // Fields
    const fields = (query?.fields as string)?.split(',')?.join(' ') || '-__v'
    modifiedQuery = modifiedQuery.select(fields)

    return {
        modelQuery: modifiedQuery,
        async getMeta() {
            const total = await modelQuery.model.countDocuments(modifiedQuery.getFilter())
            const totalPage = Math.ceil(total / limit)
            return {
                page,
                limit,
                total,
                totalPage,
            }
        },
    }
}

export default queryHelper
