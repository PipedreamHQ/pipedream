import {
  Pipedream,
} from "@pipedream/types";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  endpoint: string;
  method?: string;
  params?: object;
  data?: object;
}

export interface CreateRequirementParams extends PdAxiosRequest {
  projectId: string;
  attributes: {
    name: string;
    "author-id": User["id"];
    "assigned-to-id"?: User["id"];
    description?: string;
    version?: string;
    priority?: string;
    "custom-fields"?: Record<string, string>;
    "parent-id"?: PractiTestEntity["id"];
    tags?: string[];
  };
  traceability?: {
    "test-ids": number[];
  };
}

interface PractiTestResponse {
  data: object | object[];
}

export interface GetProjectsResponse extends PractiTestResponse {
  data: Project[];
}
export interface GetUsersResponse extends PractiTestResponse {
  data: User[];
}

interface PractiTestEntity {
  id: string;
  attributes: Record<string, string>;
}

export interface Project extends PractiTestEntity {
  attributes: {
    name: string;
  };
}
export interface User extends PractiTestEntity {
  attributes: {
    "display-name": string;
  };
}

export type Requirement = PractiTestEntity;
