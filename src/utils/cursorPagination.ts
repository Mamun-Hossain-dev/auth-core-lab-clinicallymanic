type CursorPaginationOptions = {
  limit?: string | number
  cursor?: string
  direction?: 'next' | 'prev'
}

type CursorPaginationResult = {
  limit: number
  cursor?: string
  direction?: 'next' | 'prev'
}

const cursorPagination = (options: CursorPaginationOptions): CursorPaginationResult => {
  const limit = Number(options.limit) || 10
  const cursor = options.cursor
  const direction = options.direction || 'next'

  return {
    limit,
    cursor,
    direction,
  }
}

export default cursorPagination
