type httpRequestParams = {
  endpoint: string;
  data?: object;
  method?: string,
}

type apiResponse = Promise<object>;

export {
  httpRequestParams,
  apiResponse
}