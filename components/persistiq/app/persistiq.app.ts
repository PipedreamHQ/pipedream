import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { MakeRequestParams } from "../common/types";
import utils from "../common/utils";

export default defineApp({
  type: "app",
  app: "persistiq",
  propDefinitions: {
    campaignId: {
      type: "string[]",
      label: "Campaign ID",
      description: "Campaign ID",
      async options({ page }) {
        return await utils.getAsyncOptions({
          resourceFn: this.getCampaigns,
          page: page + 1,
          resourceKey: "campaigns",
          labelKey: "name",
          valueKey: "id",
        });
      },
    },
    leadId: {
      type: "string[]",
      label: "Lead ID",
      description: "Lead ID",
      async options({ page }) {
        return await utils.getAsyncOptions({
          resourceFn: this.getLeads,
          page: page + 1,
          resourceKey: "leads",
          labelKey: "data.email",
          valueKey: "id",
        });
      },
    },
  },
  methods: {
    _getUrl(path: string): string {
      return `https://api.persistiq.com/v1${path}`;
    },
    _getHeaders(headers: object = {}): object {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    }: MakeRequestParams): Promise<object> {
      return axios($, {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      });
    },
    async getCampaigns({ ...args }: object = {}): Promise<object> {
      return this._makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    async getLeads({ ...args }: object = {}): Promise<object> {
      return this._makeRequest({
        path: "/leads",
        ...args,
      });
    },
    async createLead({ ...args }: object = {}): Promise<object> {
      return this._makeRequest({
        path: "/leads",
        method: "POST",
        ...args,
      });
    },
    async addLeadToCampaign({
      campaignId,
      ...args
    }: { campaignId: string; } = {
      campaignId: "",
    }): Promise<object> {
      return this._makeRequest({
        path: `/campaigns/${campaignId}/leads`,
        method: "POST",
        ...args,
      });
    },
    async addDoNotContactDomain({ ...args }: object = {}): Promise<object> {
      return this._makeRequest({
        path: "/dnc_domains",
        method: "POST",
        ...args,
      });
    },
  },
});
