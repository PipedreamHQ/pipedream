import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formbricks",
  propDefinitions: {
    surveyIds: {
      type: "string[]",
      label: "Survey IDs",
      description: "The IDs of the surveys to trigger the webhook. Leave empty for all surveys.",
      async options() {
        const surveys = await this.listSurveys();
        return surveys.map((survey) => ({
          label: survey.name,
          value: survey.id,
        })).concat({
          value: "[]",
          label: "All Surveys",
        });
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
      return this._makeRequest({
        url: "/management/surveys",
      });
    },
  },
};
