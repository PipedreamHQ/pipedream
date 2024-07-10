import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "survser",
  propDefinitions: {
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "Identifier of the survey to watch for responses",
      async options() {
        const surveys = await this.getSurveys();
        return surveys?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.survser.com/api/public";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
      });
    },
    getSurveys(opts = {}) {
      return this._makeRequest({
        path: "/survey/list",
        ...opts,
      });
    },
    getSurveyResponses(opts = {}) {
      return this._makeRequest({
        path: "/response/list",
        ...opts,
      });
    },
  },
};
