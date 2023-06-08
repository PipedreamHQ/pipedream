import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "concord",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description:
        "Select an **Organization** from the list, or provide a custom *Organization ID*.",
      async options() {
        const orgs = await this.getAllUserOrganizations();
        return orgs?.map(({ organization: { id, name } }) => ({
          label: name,
          value: id,
        }));
      },
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
