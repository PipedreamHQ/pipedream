import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ListAgreementsResponse,
  ListFoldersResponse,
  ListOrganizationsResponse,
} from "../common/types/responseSchemas";
import {
  CreateAgreementParams,
  HttpRequestParams,
  PatchAgreementParams,
} from "../common/types/requestParams";
import {
  AGREEMENT_LIST_STATUSES, AGREEMENT_STATUS_OPTIONS,
} from "../common/constants";

export default defineApp({
  type: "app",
  app: "concord",
  propDefinitions: {
    organizationId: {
      type: "integer",
      label: "Organization ID",
      description:
        "Select an **Organization** from the list, or provide a custom *Organization ID*. [See the documentation if needed.](https://api.doc.concordnow.com/#tag/User/operation/ListUserOrganizations)",
      async options() {
        const response: ListOrganizationsResponse =
          await this.getAllUserOrganizations();
        return response?.organizations?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    folderId: {
      type: "integer",
      label: "Folder ID",
      description:
        "Select a **Folder** from the list, or provide a custom *Folder ID*. [See the documentation if needed.](https://api.doc.concordnow.com/#tag/Folders/operation/ListFolders)",
      optional: true,
      async options({ organizationId }: { organizationId: number; }) {
        const response: ListFoldersResponse = await this.listFolders(
          organizationId,
        );
        return response?.folders?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    agreementUid: {
      type: "string",
      label: "Agreement UID",
      description:
        "Search for an **Agreement**, or provide a custom *Agreement UID*. [See the documentation if needed.](https://api.doc.concordnow.com/#tag/Agreement/operation/ListAgreements)",
      useQuery: true,
      async options({
        organizationId, query,
      }: { organizationId: number; query: string; }) {
        const response: ListAgreementsResponse = await this.listAgreements(
          organizationId,
          query,
        );
        return response?.items?.map(({
          title, status, uuid,
        }) => ({
          label: `${title} (Status: ${status})`,
          value: uuid,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Agreement status",
      options: AGREEMENT_STATUS_OPTIONS,
    },
  },
  methods: {
    _getHeaders(): Record<string, string> {
      return {
        "X-API-KEY": this.$auth.api_key,
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://${this.$auth.environment}.concordnow.com/api/rest/1`,
        headers: this._getHeaders(),
        ...args,
      });
    },
    async getAllUserOrganizations(): Promise<ListOrganizationsResponse> {
      return this._httpRequest({
        url: "/user/me/organizations",
      });
    },
    async listFolders(organizationId: number): Promise<ListFoldersResponse> {
      return this._httpRequest({
        url: `/organizations/${organizationId}/folders`,
      });
    },
    async listAgreements(organizationId: number, search: string): Promise<ListAgreementsResponse> {
      return this._httpRequest({
        url: `/user/me/organizations/${organizationId}/agreements`,
        params: {
          search,
          statuses: AGREEMENT_LIST_STATUSES.join(),
          numberOfItemsPerPage: 100,
        },
      });
    },
    async createAgreement({
      organizationId, ...args
    }: CreateAgreementParams): Promise<object> {
      return this._httpRequest({
        url: `/organizations/${organizationId}/agreements`,
        method: "POST",
        ...args,
      });
    },
    async patchAgreement({
      organizationId,
      agreementUid,
      ...args
    }: PatchAgreementParams): Promise<void> {
      return this._httpRequest({
        url: `/organizations/${organizationId}/agreements/${agreementUid}`,
        method: "PATCH",
        ...args,
      });
    },
    async requestSignature({
      organizationId,
      agreementUid,
      ...args
    }: PatchAgreementParams): Promise<void> {
      return this._httpRequest({
        url: `/organizations/${organizationId}/agreements/${agreementUid}/signature/request`,
        method: "POST",
        ...args,
      });
    },
  },
});
