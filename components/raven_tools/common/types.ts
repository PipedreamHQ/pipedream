import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface RavenToolsRequestParams extends PdAxiosRequest {
  params: object;
}

export type Domain = string;
export type Keyword = string;
export type RavenToolsEntity = Domain | Keyword;
