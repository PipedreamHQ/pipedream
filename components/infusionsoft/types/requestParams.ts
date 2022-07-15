type createHookParams = {
  eventKey: string;
  hookUrl: string;
};

type deleteHookParams = {
  key: string;
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
  orderId: number;
  data: {
    apply_to_commissions: boolean;
    charge_now: boolean;
    credit_card_id: number;
    date: string;
    notes: string;
    payment_amount: string;
    payment_gateway_id: string;
    payment_method_type: string;
  };
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
  createHookParams,
  deleteHookParams,
  createOrderItemParams,
  createPaymentParams,
  getCompanyParams,
  getContactParams,
  httpRequestParams,
};
