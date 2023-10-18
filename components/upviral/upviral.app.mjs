import { axios } from "@pipedream/platform";
import FormData from "form-data";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "upviral",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "The Id of the campaign.",
      async options() {
        const { data } = await this.listCampaigns({});

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leadId: {
      type: "string",
      label: "Lead Id",
      description: "The Id of the lead.",
      async options({
        page, campaignId,
      }) {
        var formData = new FormData();
        formData.append("campaign_id", campaignId);
        const { data } = await this.listLeads({
          params: {
            start: LIMIT * page,
            size: LIMIT,
          },
          data: formData,
          headers: formData.getHeaders(),
        });

        return data.leads.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.upviral.com/api/v1";
    },
    _getParams(params) {
      return {
        uvapikey: this._apiKey(),
        ...params,
      };
    },
    _makeRequest({
      $ = this, params, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}`,
        params: this._getParams(params),
        ...opts,
      };

      return axios($, config);
    },
    addContact({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          uvmethod: "add_contact",
          ...params,
        },
        ...args,
      });
    },
    addPoints({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          uvmethod: "add_points",
          ...params,
        },
        ...args,
      });
    },
    listCampaigns({
      params = {}, ...args
    }) {
      return this._makeRequest({
        params: {
          uvmethod: "lists",
          ...params,
        },
        ...args,
      });
    },
    listCustomFields({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          uvmethod: "get_custom_fields",
          ...params,
        },
        ...args,
      });
    },
    listLeads({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          uvmethod: "get_leads",
          ...params,
        },
        ...args,
      });
    },
  },
};
