import { Pipedream } from "@pipedream/types";

interface ActionRequestParams {
  $?: Pipedream;
}

interface HttpRequestParams extends ActionRequestParams {
  endpoint?: string;
  data?: object;
  method?: string;
}

interface GetShipmentParams extends ActionRequestParams {
  id: number;
}

export {
  GetShipmentParams,
  HttpRequestParams,
};
