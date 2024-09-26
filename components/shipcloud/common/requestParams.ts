import { Pipedream } from "@pipedream/types";
import { Address } from "./responseSchemas";

interface ActionRequestParams {
  $?: Pipedream;
}

interface CreateShipmentQuoteParams extends ActionRequestParams {
  data: {
    carrier: string;
    service: string;
    to: Address;
    from: Address;
    package: object;
  };
}

type CreateShipmentParams = ActionRequestParams &
  CreateShipmentQuoteParams & {
    data: {
      additionalOptions: object;
    };
  };

interface GetShipmentParams extends ActionRequestParams {
  id: string;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint?: string;
  data?: object;
  method?: string;
}

interface CreateHookParams {
  event_types: string[];
  url: string;
}

interface DeleteHookParams {
  id: string;
}

export {
  CreateShipmentParams,
  CreateShipmentQuoteParams,
  GetShipmentParams,
  HttpRequestParams,
  CreateHookParams,
  DeleteHookParams,
};
