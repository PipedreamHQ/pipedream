import { Pipedream } from "@pipedream/types";

export interface MakeRequestParams {
  $?: Pipedream;
  path: string;
  headers?: object;
  otherConfig?: object;
}

export interface ResourceFn {
  (params:object): Promise<any>;
}

export interface ResourceGeneratorParams {
  resourceFn: ResourceFn;
}
