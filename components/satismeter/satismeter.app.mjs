import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "satismeter",
  propDefinitions: {
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "The ID of the survey.",
      optional: true,
      async options() {
        const { data } = await this.listSurveys();
        return data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://app.satismeter.com/api/v3/projects/${this._getProjectId()}/`;
    },
    _getProjectId() {
      return this.$auth.project_id;
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...args,
      });
    },
    listSurveys() {
      return this._makeRequest({
        path: "campaigns",
      });
    },
    getSurveyResponses({
      surveyId, ...args
    }) {
      let path = "responses";
      if (surveyId) {
        path = `campaigns/${surveyId}/responses`;
      }
      return this._makeRequest({
        path,
        ...args,
      });
    },
  },
};
