import {
  Agreement,
  Folder, Organization,
} from "./entities";

export interface ListOrganizationsResponse {
  organizations: Organization[];
}

export interface ListFoldersResponse {
  folders: Folder[];
}

export interface ListAgreementsResponse {
  items: Agreement[];
}

export interface CreateAgreementResponse {
  uid: string;
}
