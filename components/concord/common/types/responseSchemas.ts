import {
  Agreement,
  Organization,
} from "./entities";

export interface ListOrganizationsResponse {
  organizations: Organization[];
}

export interface ListAgreementsResponse {
  items: Agreement[];
}

export interface CreateAgreementResponse {
  uid: string;
}
