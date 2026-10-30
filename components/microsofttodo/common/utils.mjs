export const isNotFoundError = (error) => [
  error?.status,
  error?.statusCode,
  error?.response?.status,
  error?.cause?.status,
].includes(404);
