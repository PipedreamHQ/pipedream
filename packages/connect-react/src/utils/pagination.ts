export type PaginatedPage<T> = {
  data?: T[];
  hasNextPage: () => boolean;
  getNextPage: () => Promise<PaginatedPage<T>>;
};

export const isPaginatedPage = <T, >(value: unknown): value is PaginatedPage<T> => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    hasNextPage?: unknown;
    getNextPage?: unknown;
  };

  return (
    typeof candidate.hasNextPage === "function"
    && typeof candidate.getNextPage === "function"
  );
};

export const clonePaginatedPage = <T, >(page: PaginatedPage<T>): PaginatedPage<T> => {
  const prototype = Object.getPrototypeOf(page);
  return Object.assign(Object.create(prototype ?? Object.prototype), page);
};
