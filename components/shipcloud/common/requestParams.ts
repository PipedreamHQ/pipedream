import { Pipedream } from "@pipedream/types";
import { Address } from "./responseSchemas";

interface ActionRequestParams {
  $?: Pipedream;
}

interface CreateShipmentParams extends ActionRequestParams {
  data: {
    carrier: string;
    to: Address;
    from: Address;
    package: object;
    additionalOptions: object;
  };
}

interface GetShipmentParams extends ActionRequestParams {
  id: number;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint?: string;
  data?: object;
  method?: string;
}

export { CreateShipmentParams, GetShipmentParams, HttpRequestParams };
