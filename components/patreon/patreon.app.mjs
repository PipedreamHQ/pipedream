import axios from "axios"; // url encoding in @pipedream/platform is not working for page param
import urlApi from "url";

export default {
  type: "app",
  app: "patreon",
  propDefinitions: {
    campaign: {
      type: "string",
      label: "Campaign",
      description: "Patreon Campaign",
      async options({ prevContext }) {
        const opts = {};
        if (prevContext?.nextCursor) {
          opts.params = {
            "page[cursor]": prevContext.nextCursor,
          };
        }
        const {
          meta,
          data: campaigns,
        } = await this.listCampaigns(opts);
        return {
          options: campaigns.map((campaign) => campaign.id),
          context: {
            nextCursor: meta.pagination.cursors?.next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.patreon.com/api/oauth2/v2";
    },
    async _makeRequest({
      path, ...opts
    }) {
      try {
        let url = new urlApi.URL(this._baseUrl() + path);
        let {
          params = {},
          ...otherOpts
        } = opts;
        Object.entries(params).forEach((entry) => url.searchParams.append(entry[0], entry[1]));
        const response = await axios({
          url,
          headers: {
            "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          ...otherOpts,
        });
        return response.data;
      } catch (error) {
        const message = JSON.stringify(error.response.data.errors);
        throw new Error(message);
      }
    },
    async listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    async createWebhook(data = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        data: {
          data,
        },
      });
    },
    async deleteWebhook({ id }) {
      return this._makeRequest({
        path: `/webhooks/${id}`,
        method: "delete",
      });
    },
  },
};
