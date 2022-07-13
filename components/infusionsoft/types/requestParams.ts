type createOrderItemParams = {
  orderId: number;
  data: {
    description: string;
    price: string;
    productId: number;
    quantity: number;
  };
};

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

export {
  createOrderItemParams,
  createPaymentParams,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
};
