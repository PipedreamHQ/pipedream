import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "satismeter",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
    },
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "The ID of the survey",
      optional: true,
      async options({ prevContext }) {
        const { projectId } = this;
        const surveys = await this.listSurveys({
          projectId,
        });
        return surveys.map((survey) => ({
          value: survey.id,
          label: survey.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.satismeter.com/api";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listSurveys({ projectId }) {
      return this._makeRequest({
        path: `/projects/${projectId}/campaigns`,
      });
    },
    async getSurveyResponses({
      projectId, surveyId,
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/campaigns/${surveyId}/responses`,
      });
    },
  },
};
