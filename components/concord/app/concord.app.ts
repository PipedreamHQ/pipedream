import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

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
        const orgs = await this.getAllUserOrganizations();
        return orgs?.map(({ organization: { id, name } }) => ({
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
      async options({ organizationId }) {
        const folders = await this.getFolders(organizationId);
        return folders?.map(({ organization: { id, name } }) => ({
          label: name,
          value: id,
        }));
      },
      optional: true
    },
  },
  methods: {
    _getHeaders() {
      return {
        "X-API-KEY": this.$auth.api_key,
        "Content-Type": "application/json",
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
    async getAllUserOrganizations() {
      return this._httpRequest({
        url: "user/me/organizations",
      });
    },
  },
});
