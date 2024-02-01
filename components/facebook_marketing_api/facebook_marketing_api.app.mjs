import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "facebook_marketing_api",
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
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to add to the custom audience segment.",
    },
    customAudienceId: {
      type: "string",
      label: "Custom Audience",
      description: "Select the custom audience to add an email to.",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const response = await this.listCustomAudiences({
          params: {
            page,
          },
        });
        return {
          options: response.data.map((audience) => ({
            label: audience.name,
            value: audience.id,
          })),
          context: {
            page: page + 1,
          },
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
    async createCustomAudience({
      adAccountId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/act_${adAccountId}/customaudiences`,
        ...args,
        data: {
          ...args.data,
          subtype: "CUSTOM",
          customer_file_source: "USER_PROVIDED_ONLY",
        },
      });
    },
    async addEmailToCustomAudience({
      customAudienceId, email,
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
      });
    },
    async listCustomAudiences({ params }) {
      return this._makeRequest({
        path: "/act_<AD_ACCOUNT_ID>/customaudiences",
        params,
      });
    },
  },
};
