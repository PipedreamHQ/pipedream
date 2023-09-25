function checkResponse(response) {
  console.log(JSON.stringify(response, null, 2));
  const isStr = typeof response === "string";
  const responseToLowerCase = isStr && response.toLocaleLowerCase();
  const hasSuccess = responseToLowerCase?.includes("success");
  const hasError = responseToLowerCase?.includes("error");
  if (!hasSuccess || hasError) {
    throw new Error(response);
  }
  return response;
}

export default {
  checkResponse,
};
