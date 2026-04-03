export const paginate = (query: Record<string, string | undefined>) => {
  const page   = Math.max(1, parseInt(query.page  || '1'));
  const limit  = Math.min(50, Math.max(1, parseInt(query.limit || '12')));
  const offset = (page - 1) * limit;
  return { page, limit, offset, skip: offset };
};

export const paginatedResponse = <T>(data: T[], total: number, page: number, limit: number) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});
