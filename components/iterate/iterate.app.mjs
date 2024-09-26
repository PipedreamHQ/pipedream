import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "iterate",
  propDefinitions: {
    surveyId: {
      label: "Survey ID",
      description: "The survey ID",
      type: "string",
      async options() {
        const surveys = await this.getSurveys();

        return surveys.map((survey) => ({
          label: survey.title,
          value: survey.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://iteratehq.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          access_token: this._apiKey(),
          ...args.params,
        },
      });

    },
    async getSurveys(args = {}) {
      const response = await this._makeRequest({
        path: "/surveys",
        ...args,
      });

      return response.results;
    },
    async getAnswers({
      surveyId, ...args
    }) {
      const response = await this._makeRequest({
        path: `/surveys/${surveyId}/responses`,
        ...args,
      });

      return {
        next: response?.links?.next,
        resources: response?.results?.list ?? [],
      };
    },
    async getResponses({
      surveyId, ...args
    }) {
      const response = await this._makeRequest({
        path: `/surveys/${surveyId}/response-groups`,
        ...args,
      });

      return {
        next: response?.links?.next,
        resources: response?.results?.response_groups ?? [],
      };
    },
  },
};
