import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ListAgreementsResponse,
  ListOrganizationsResponse,
} from "../common/types/responseSchemas";
import {
  CreateAgreementParams,
  HttpRequestParams,
  ListAgreementParams,
  PatchAgreementParams,
} from "../common/types/requestParams";
import { AGREEMENT_LIST_STATUSES } from "../common/constants";
import {
  Agreement, Folder,
} from "../common/types/entities";
import {
  AgreementOption,
  AsyncOptionsOrgId, FolderOption,
} from "../common/types/misc";

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
      async options({ organizationId }: { organizationId: number; }): Promise<FolderOption[]> {
        return this.listFolders(organizationId);
      },
    },
    agreementUid: {
      type: "string",
      label: "Agreement UID",
      description:
        "Search for an **Agreement**, or provide a custom *Agreement UID*. [See the documentation if needed.](https://api.doc.concordnow.com/#tag/Agreement/operation/ListAgreements)",
      useQuery: true,
      async options({
        organizationId,
        query,
      }: AsyncOptionsOrgId): Promise<AgreementOption[]> {
        return this.getAgreementOptions({
          organizationId,
          search: query,
        }, true);
      },
    },
    templateUid: {
      type: "string",
      label: "Template UID",
      description:
        "Search for a **Template**, or provide a custom *Template UID*. [See the documentation if needed.](https://api.doc.concordnow.com/#tag/Agreement/operation/ListAgreements)",
      useQuery: true,
      async options({
        organizationId,
        query,
      }: AsyncOptionsOrgId): Promise<AgreementOption[]> {
        return this.getAgreementOptions({
          organizationId,
          search: query,
          statuses: [
            "TEMPLATE",
            "TEMPLATE_AUTO",
          ],
        });
      },
    },
    contractUid: {
      type: "string",
      label: "Contract UID",
      description:
        "Search for a **Contract**, or provide a custom *Contract UID*. [See the documentation if needed.](https://api.doc.concordnow.com/#tag/Agreement/operation/ListAgreements)",
      useQuery: true,
      async options({
        organizationId,
        query,
      }: AsyncOptionsOrgId): Promise<AgreementOption[]> {
        return this.getAgreementOptions({
          organizationId,
          search: query,
          statuses: AGREEMENT_LIST_STATUSES.filter((s) => s.includes("CONTRACT")),
        }, true);
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Agreement title",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Agreement description",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Agreement tags",
      optional: true,
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
    unwrapChildFolders(folder: Folder, parentName = ""): FolderOption[] {
      const {
        id, name = "", children,
      } = folder;
      const fullName = `${parentName}/${name}`;
      const obj: FolderOption = {
        label: fullName.replace(/\/{2,}/g, "/"),
        value: id,
      };

      return [
        obj,
        ...(children?.flatMap((f) => this.unwrapChildFolders(f, fullName)) ?? []),
      ];
    },
    async listFolders(organizationId: number): Promise<Folder[]> {
      const rootFolder = await this._httpRequest({
        url: `/organizations/${organizationId}/folders`,
      });
      return rootFolder
        ? this.unwrapChildFolders(rootFolder)
        : [];
    },
    async getAgreementOptions({
      organizationId, search, statuses = AGREEMENT_LIST_STATUSES,
    }: ListAgreementParams, showStatus = false): Promise<AgreementOption[]> {
      const items: Agreement[] = await this.listAgreements({
        organizationId,
        search,
        statuses,
      });
      return items?.map(({
        title, status, uuid,
      }) => ({
        label: showStatus
          ? `${title} (Status: ${status})`
          : title,
        value: uuid,
      }));
    },
    async listAgreements({
      organizationId,
      search,
      statuses = AGREEMENT_LIST_STATUSES,
    }: ListAgreementParams) {
      const response: ListAgreementsResponse = await this._httpRequest({
        url: `/user/me/organizations/${organizationId}/agreements`,
        params: {
          search,
          statuses: statuses.join(),
          numberOfItemsPerPage: 100,
        },
      });
      return response?.items;
    },
    async createAgreement({
      organizationId,
      ...args
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
    }: PatchAgreementParams): Promise<object> {
      return this._httpRequest({
        url: `/organizations/${organizationId}/agreements/${agreementUid}/signature/request`,
        method: "POST",
        ...args,
      });
    },
  },
});
