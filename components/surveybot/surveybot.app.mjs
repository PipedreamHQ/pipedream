import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "surveybot",
  propDefinitions: {
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "The ID of the survey to get responses for",
      async options({ page }) {
        const { surveys } = await this.listSurveys({
          params: {
            page: page + 1,
          },
        });
        return surveys.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    respondentId: {
      type: "string",
      label: "Respondent ID",
      description: "The ID of the respondent to get",
      async options({ surveyId }) {
        const { responses } = await this.getSurveyResponses({
          surveyId,
        });

        return responses.map(({
          respondent: {
            id: value,
            name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://surveybot.io/api/v1";
    },
    _getHeaders() {
      return {
        "X-Api-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listSurveys(args = {}) {
      return this._makeRequest({
        path: "surveys",
        ...args,
      });
    },
    getSurveyResponses({
      surveyId, ...args
    }) {
      return this._makeRequest({
        path: `surveys/${surveyId}/responses`,
        ...args,
      });
    },
    getSurveyRespondent({
      respondentId, ...args
    }) {
      return this._makeRequest({
        path: `respondents/${respondentId}`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, dataField, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const response = await fn({
          params,
          ...opts,
        });

        const data = response[dataField];
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
