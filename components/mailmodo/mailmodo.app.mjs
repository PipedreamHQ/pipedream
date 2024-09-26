import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "mailmodo",
  propDefinitions: {
    listName: {
      type: "string",
      label: "List",
      description: "List Name",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getLists,
          resourceKey: "listDetails",
          labelVal: {
            label: (list) => `${list.name}(${list.contacts_count} contacts)`,
            value: "name",
          },
        });
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "Campaign ID",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getCampaigns,
          resourceKey: "campaigns",
          params: {
            type: "TRIGGERED",
          },
          labelVal: {
            label: "campaignName",
            value: "id",
          },
        });
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user",
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.mailmodo.com/api/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "mmApiKey": this.$auth.api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getLists(args = {}) {
      return this._makeRequest({
        path: "/getAllContactLists",
        ...args,
      });
    },
    async getCampaigns(args = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    async getTemplates(args = {}) {
      return this._makeRequest({
        path: "/getAllTemplates",
        ...args,
      });
    },
    async addContactToList(args = {}) {
      return this._makeRequest({
        path: "/addToList",
        method: "POST",
        ...args,
      });
    },
    async triggerCampaign({
      campaignId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/triggerCampaign/${campaignId}`,
        method: "POST",
        ...args,
      });
    },
    async triggerJourney({
      journeyId,
      ...args
    } = {}) {
      return this._makeRequest({
        url: `https://api.mailmodo.com/hooks/start/${journeyId}`,
        method: "POST",
        ...args,
      });
    },
  },
};
