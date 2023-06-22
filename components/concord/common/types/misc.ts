import { Folder } from "./entities";
import { OrganizationId } from "./requestParams";

export interface FolderOption {
  label: string;
  value: Folder["id"];
}

export interface AsyncOptionsOrgId extends OrganizationId {
  query: string;
}
