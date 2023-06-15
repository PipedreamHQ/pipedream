import { Pipedream } from "@pipedream/types";
import {
  Folder, Organization,
} from "./types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method?: string;
  data?: object;
  params?: object;
}

interface OrganizationId {
  organizationId: Organization["id"];
}

export interface CreateAgreementParams extends PdAxiosRequest, OrganizationId {
  data: OrganizationId & {
    folderId?: Folder["id"];
    source?: object;
    status?: string;
    parametersSource?: string;
    title?: string;
    description?: string;
    tags?: string[];
  };
}

export interface PatchAgreementParams extends PdAxiosRequest, OrganizationId {
  agreementUid: string;
  data: {
    status: string;
  }
}
