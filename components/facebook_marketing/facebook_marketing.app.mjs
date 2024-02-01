import { axios } from "@pipedream/platform";
import { CUSTOMER_FILE_SOURCE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "facebook_marketing",
  propDefinitions: {
    name: {
      type: "string",
      label: "Audience Name",
      description: "The name of the custom audience.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the custom audience.",
    },
    customerFileSource: {
      type: "string",
      label: "Customer File Source",
      description: "Describes how the customer information in your Custom Audience was originally collected.",
      options: CUSTOMER_FILE_SOURCE_OPTIONS,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to add to the custom audience segment.",
    },
    adAccountId: {
      type: "string",
      label: "Ad Account ID",
      description: "The ID of the Ad Account.",
      async options() {
        const { id } = await this.getAuthenticatedUserInfo();
        const { data } = await this.getUserAdAccounts({
          id,
        });
        return data?.map?.((account) => account.account_id);
      },
    },
    customAudienceId: {
      type: "string",
      label: "Custom Audience",
      description: "Select the custom audience to add an email to.",
      async options({ adAccountId }) {
        const response = await this.listCustomAudiences({
          adAccountId,
        });
        return {
          options: response.data.map((audience) => ({
            label: audience.name,
            value: audience.id,
          })),
        };
      },
    },
  },
  methods: {
    _apiVersion() {
      return "v19.0";
    },
    _baseUrl() {
      return `https://graph.facebook.com/${this._apiVersion()}`;
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getAuthenticatedUserInfo() {
      return this._makeRequest({
        path: "/me",
      });
    },
    async getUserAdAccounts({ id }) {
      return this._makeRequest({
        path: `/${id}/adaccounts`,
      });
    },
    async createCustomAudience({
      adAccountId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/act_${adAccountId}/customaudiences`,
        ...args,
      });
    },
    async addEmailToCustomAudience({
      customAudienceId, email, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${customAudienceId}/users`,
        data: {
          payload: {
            schema: [
              "EMAIL",
            ],
            data: [
              [
                email,
              ],
            ],
          },
        },
        ...args,
      });
    },
    async listCustomAudiences({
      adAccountId, ...args
    }) {
      return this._makeRequest({
        path: `/act_${adAccountId}/customaudiences`,
        ...args,
      });
    },
  },
};
