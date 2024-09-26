import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $?: Pipedream;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint?: string;
  data?: object;
  method?: string;
  url?: string;
}

interface CreateOrderItemParams extends ActionRequestParams {
  orderId: number;
  data: {
    description: string;
    price: string;
    product_id: number;
    quantity: number;
  };
}

interface CreatePaymentParams extends ActionRequestParams {
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
}

interface GetObjectParams extends ActionRequestParams {
  id: number;
}

interface CreateHookParams {
  eventKey: string;
  hookUrl: string;
}

interface DeleteHookParams {
  key: string;
}

export {
  CreateHookParams,
  DeleteHookParams,
  CreateOrderItemParams,
  CreatePaymentParams,
  GetObjectParams,
  HttpRequestParams,
};
