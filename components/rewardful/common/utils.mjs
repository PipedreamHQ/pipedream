// List endpoints wrap results as `{ pagination, data }`, but some return a bare array.
export const getItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  return response?.data ?? [];
};

export const formatAmount = (cents, currency) => {
  if (typeof cents !== "number") {
    return "";
  }
  return `${(cents / 100).toFixed(2)} ${currency ?? ""}`.trim();
};
