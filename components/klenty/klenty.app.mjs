import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "klenty",
  propDefinitions: {
    prospectEmail: {
      type: "string",
      label: "Prospect Email",
      description: "The prospect's email address.",
      async options({ prevContext }) {
        const { page = 0 } = prevContext;
        const { items } = await this.getProspectsByList({
          params: {
            start: page,
          },
        });
        return {
          options: items.map(({
            Email, FullName,
          }) => ({
            label: FullName,
            value: Email,
          })),
          context: {
            page: page + 100,
          },
        };
      },
    },
    prospectListName: {
      type: "string",
      label: "Prospect List Name",
      description: "The name of the list to add the prospect to.",
    },
    jobid: {
      type: "string",
      label: "Job ID",
      description: "The unique identifier for the print job.",
    },
    prospectData: {
      type: "object",
      label: "Prospect Data",
      description: "The data for the new or existing prospect.",
    },
    event: {
      type: "string",
      label: "Event",
      description: "The event type for the webhook.",
      options: [
        {
          label: "Send Prospect",
          value: "sendprospect",
        },
        {
          label: "On Mail Bounce",
          value: "onmailbounce",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.klenty.com/apis/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createWebhook({ event }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event,
        },
      });
    },
    async addProspectToList({
      prospectListName, prospectData,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/prospects",
        data: {
          ListName: prospectListName,
          ...prospectData,
        },
      });
    },
    async updateProspect({
      prospectEmail, prospectData,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/prospects/${prospectEmail}`,
        data: {
          ...prospectData,
        },
      });
    },
    async checkPrintJobStatus({ jobid }) {
      return this._makeRequest({
        method: "GET",
        path: `/printjobs/${jobid}/status`,
      });
    },
    async getProspectsByList(opts = {}) {
      return this._makeRequest({
        path: "/prospects",
        ...opts,
      });
    },
  },
  version: "0.0.{{ts}}",
};
