import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface RavenToolsRequestParams extends PdAxiosRequest {
  method: string;
}

export type Domain = string;