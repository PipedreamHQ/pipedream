import { Pipedream } from "@pipedream/types";
import { Folder, Organization } from "./types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  params?: object;
}

export interface CreateAgreementParams extends PdAxiosRequest {
  organizationId: Organization["id"];
  data: {
    organizationId: Organization["id"];
    folderId?: Folder["id"];
    source?: object;
    status?: string;
    parametersSource?: string;
    title?: string;
    description?: string;
    tags?: string[];
  }
}