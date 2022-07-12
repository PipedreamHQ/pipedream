type apiResponse = Promise<object>;


type getCompanyParams = {
  companyId: number;
}

type getContactParams = {
  contactId: number;
}

type httpRequestParams = {
  endpoint: string;
  data?: object;
  method?: string,
}

export {
  apiResponse,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
}