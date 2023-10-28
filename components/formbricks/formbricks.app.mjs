import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formbricks",
  propDefinitions: {
    surveyIds: {
      type: "string[]",
      label: "Survey IDs",
      description: "The survey(s) to watch for new responses. If not provided, events will be triggered for all surveys.",
      async options() {
        const surveys = await this.listSurveys();
        return surveys.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: `https://${this.$auth.hostname}/api/v1`,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async listSurveys() {
      const { data } = await this._makeRequest({
        url: "/management/surveys",
      });
      return data;
    },
    async createWebhook(args) {
      const { data } = await this._makeRequest({
        method: "POST",
        url: "/webhooks",
        ...args,
      });
      return data;
    },
    async deleteWebhook({
      id, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `/webhooks/${id}`,
        ...args,
      });
    },
  },
};
