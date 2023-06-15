import { Folder, Organization } from "./types";

export interface ListOrganizationsResponse {
  organizations: Organization[];
}

export interface ListFoldersResponse {
  folders: Folder[];
}
