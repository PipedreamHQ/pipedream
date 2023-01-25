import { Pipedream } from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface RavenToolsRequestParams extends PdAxiosRequest {
  params: object;
}

export type RavenToolsResponse =
  | {
      response: "success";
    }
  | undefined;

export interface AddKeywordParams extends RavenToolsRequestParams {
  params: { domain: string; keyword: string; };
}
