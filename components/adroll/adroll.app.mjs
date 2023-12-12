import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adroll",
  propDefinitions: {
    audienceId: {
      label: "Audience Id",
      description: "The Id of the CRM audience",
      type: "string",
      async options({ advertiserId }) {
        const audiences = await this.listAudienceOpts({
          advertiserId,
        });
        return audiences.segments.map(({
          segment_id,
          name,
        }) => ({
          label: name,
          value: segment_id,
        }));
      },
    },
    advertiserId: {
      label: "Advertiser Id",
      description: "The Id of the Advertiser",
      type: "string",
      async options() {
        const advertisers = await this.listAdvertiserOpts();
        return advertisers.data.map(({ advertiser_id }) => (advertiser_id));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://services.adroll.com";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async replaceEmailsFromCRMAudience({
      emails,
      audienceId,
    }) {
      const data = emails.map((email) => ({
        email,
      }));
      return this._makeRequest({
        path: `/audience/v1/segments/${audienceId}`,
        method: "post",
        data: {
          data,
        },
      });
    },
    listAudienceOpts({ advertiserId }) {
      return this._makeRequest({
        path: "/audience/v1/segments",
        method: "get",
        params: {
          advertiser_id: advertiserId,
          type: "crm",
        },
      });
    },
    listAdvertiserOpts() {
      return this._makeRequest({
        path: "/audience/v1/advertisers",
        method: "get",
      });
    },
  },
};
