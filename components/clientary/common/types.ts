import { Pipedream } from "@pipedream/types";

export interface AuthParams {
  username: string;
  password: string;
}

export interface MakeRequestParams {
  $?: Pipedream;
  path: string;
  headers?: object;
  otherConfig?: object;
}

export interface GetRequestMethodParams {
  name: string;
  method: string;
}

export interface SourceConfig {
  resourceFnName: string;
  resourceName: string;
  hasPaging: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestMethod = (args: object) => Promise<any>;

export interface ResourceFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (params:object): Promise<any>;
}

export interface ResourceGeneratorParams {
  resourceFn: ResourceFn;
  resourceName: string;
  hasPaging: boolean;
}

export interface AsyncOptionsParams {
  resourceFn: ResourceFn;
  page: number;
  resourceKey: string;
  labelKey: string;
  valueKey: string;
}
