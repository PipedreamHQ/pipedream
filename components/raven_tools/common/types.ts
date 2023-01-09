import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface RavenToolsRequestParams extends PdAxiosRequest {
  method: string;
}

export type Domain = string;
export type Keyword = string;
export type RavenToolsEntity = Domain | Keyword;
