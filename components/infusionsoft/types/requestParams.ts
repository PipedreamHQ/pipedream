type CreateHookParams = {
  eventKey: string;
  hookUrl: string;
};

type DeleteHookParams = {
  key: string;
};

type CreateOrderItemParams = {
  orderId: number;
  data: {
    description: string;
    price: string;
    productId: number;
    quantity: number;
  };
};

type CreatePaymentParams = {
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

type GetObjectParams = {
  id: number;
};

type HttpRequestParams = {
  endpoint?: string;
  data?: object;
  method?: string;
  url?: string;
};

export {
  CreateHookParams,
  DeleteHookParams,
  CreateOrderItemParams,
  CreatePaymentParams,
  GetObjectParams,
  HttpRequestParams,
};
