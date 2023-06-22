import { Pipedream } from "@pipedream/types";
import {
  Agreement, Folder, Organization,
} from "./entities";

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

interface AgreementUid {
  agreementUid: Agreement["uuid"];
}

export interface CreateTemplateParams extends PdAxiosRequest, OrganizationId {
  data: OrganizationId & {
    folderId?: Folder["id"];
    title: string;
    status: "TEMPLATE";
    description?: string;
    tags?: string[];
  };
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

export interface PatchAgreementParams
  extends PdAxiosRequest,
    OrganizationId,
    AgreementUid {
  data: {
    status: string;
  };
}

export interface RequestSignatureParams
  extends PdAxiosRequest,
    OrganizationId,
    AgreementUid {}

export interface ListAgreementParams extends PdAxiosRequest, OrganizationId {
  statuses?: string[];
  search?: string;
}
