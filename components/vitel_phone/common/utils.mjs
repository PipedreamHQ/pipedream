function checkResponse(response) {
  const isStr = typeof response === "string";
  const responseToLowerCase = isStr && response.toLowerCase();
  const hasInvalid = isStr && responseToLowerCase?.includes("invalid");
  const hasError = isStr && responseToLowerCase?.includes("error");
  if (hasInvalid || hasError) {
    throw new Error(response);
  }
  if (response?.error) {
    throw new Error(response.error);
  }
  return response;
}

export default {
  checkResponse,
};
