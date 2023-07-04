import {
  Agreement, Folder,
} from "./entities";
import { OrganizationId } from "./requestParams";

export interface FolderOption {
  label: string;
  value: Folder["id"];
}
export interface AgreementOption {
  label: string;
  value: Agreement["uuid"];
}

export interface AsyncOptionsOrgId extends OrganizationId {
  query: string;
}
