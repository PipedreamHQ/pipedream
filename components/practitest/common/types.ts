import { Pipedream } from "@pipedream/types";

type PdObjectProp = Record<string, string>;

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  endpoint: string;
  method?: string;
  params?: object;
  data?: object;
}

interface ProjectRequest extends PdAxiosRequest {
  projectId: string;
}

export interface CreateRequirementParams extends ProjectRequest {
  attributes: {
    name: string;
    "author-id": User["id"];
    "assigned-to-id"?: User["id"];
    description?: string;
    version?: string;
    priority?: string;
    "custom-fields"?: PdObjectProp;
    "parent-id"?: PractiTestEntity["id"];
    tags?: string[];
  };
  traceability?: {
    "test-ids": number[];
  };
}

export interface CreateRunParams extends ProjectRequest {
  attributes: {
    "instance-id": number;
    "exit-code"?: number;
    "run-duration"?: string;
    "automated-execution-output"?: string;
    version?: string;
    "custom-fields"?: PdObjectProp;
  };
  steps?: {
    data: PdObjectProp[];
  };
  files?: {
    data: PdObjectProp[];
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
export interface GetInstancesResponse extends PractiTestResponse {
  data: Instance[];
}
export interface GetIssuesResponse extends PractiTestResponse {
  data: Issue[];
}
export interface GetTestsResponse extends PractiTestResponse {
  data: Test[];
}

export interface CreateRequirementResponse extends PractiTestResponse {
  data: Requirement;
}
export interface CreateRunResponse extends PractiTestResponse {
  data: Run;
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

export interface Instance extends PractiTestEntity {
  attributes: {
    name: string;
  };
}

export interface Issue extends PractiTestEntity {
  attributes: {
    title: string;
    "created-at": string;
  };
}

export interface Test extends PractiTestEntity {
  attributes: {
    name: string;
    "created-at": string;
  };
}

export type Requirement = PractiTestEntity;
export type Run = PractiTestEntity;
