type asyncOptionsObject = {
  label: string;
  value: any;
};

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

type company = {
  company_name: string;
  id: number;
};

type contact = {
  given_name: string;
  id: number;
};

type order = {
  contact: {
    first_name: string;
    last_name: string;
  };
  id: number;
  order_items: object[];
  total: number;
};

type product = {
  id: number;
  product_name: string;
  product_price: number;
};

export {
  asyncOptionsObject,
  createOrderItemParams,
  createPaymentParams,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
  company,
  contact,
  order,
  product,
};
