type httpRequestParams = {
  method: string,
  endpoint: string;
  data?: object;
}

type apiResponse = Promise<object>;

type sendMessageParams = {
  from: string;
  to: string[];
  text?: string;
  tag?: string;
}

export {
  httpRequestParams,
  apiResponse,
  sendMessageParams
}