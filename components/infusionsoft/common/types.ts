type apiResponse = Promise<object>;

type createPaymentParams = {
  data: object;
  orderId: number;
};

type getCompanyParams = {
  companyId: number;
};

type getContactParams = {
  contactId: number;
};

type httpRequestParams = {
  endpoint: string;
  data?: object;
  method?: string;
};

type companyObject = {
  company_name: string;
  id: number;
};

type contactObject = {
  given_name: string;
  id: number;
};

type orderObject = {
  contact: {
    first_name: string;
    last_name: string;
  };
  id: number;
  order_items: object[];
  total: number;
};

export {
  apiResponse,
  createPaymentParams,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
  companyObject,
  contactObject,
  orderObject,
};
