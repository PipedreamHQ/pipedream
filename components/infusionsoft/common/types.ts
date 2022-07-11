type httpRequestParams = {
  method: string,
  endpoint: string;
  data?: object;
}

type apiResponse = Promise<object>;

export {
  httpRequestParams,
  apiResponse
}