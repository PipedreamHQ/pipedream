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
          value: "",
          label: "All Surveys",
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.formbricks.com/api/v1";
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
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async listSurveys() {
      return this._makeRequest({
        path: "/management/surveys",
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
