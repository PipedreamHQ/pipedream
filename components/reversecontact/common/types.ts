import { Pipedream } from "@pipedream/types";

export interface MakeRequestParams {
  $?: Pipedream;
  path: string;
  headers?: object;
  otherConfig?: object;
}

export interface ProfileEnrichmentResult {
  person?: boolean | object;
  credits_left?: number;
}
