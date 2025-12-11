import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "survicate",
  propDefinitions: {
    surveyId: {
      type: "string",
      label: "Survey",
      description: "The ID of the survey",
      async options({ prevContext }) {
        if (prevContext?.start === null) {
          return [];
        }

        const response = await this.listSurveys({
          params: {
            items_per_page: constants.DEFAULT_LIMIT,
            start: prevContext?.start,
          },
        });

        const options = response?.data?.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            start: response.pagination_data?.has_more
              ? new URL(response.pagination_data.next_url, constants.BASE_URL).searchParams.get("start")
              : null,
          },
        };
      },
    },
    responseId: {
      type: "string",
      label: "Response",
      description: "The ID of the response",
      async options({
        surveyId, prevContext,
      }) {
        if (prevContext?.start === null) {
          return [];
        }

        const response = await this.listResponses({
          surveyId,
          params: {
            items_per_page: constants.DEFAULT_LIMIT,
            start: prevContext?.start,
          },
        });

        const options = response?.data?.map(({
          uuid: value,
          collected_at: collectedAt,
          respondent: { uuid: respondentUuid },
        }) => ({
          label: `Respondent ${respondentUuid} - ${collectedAt}`,
          value,
        })) || [];

        return {
          options,
          context: {
            start: response.pagination_data?.has_more
              ? new URL(response.pagination_data.next_url, constants.BASE_URL).searchParams.get("start")
              : null,
          },
        };
      },
    },
    respondentUuid: {
      type: "string",
      label: "Respondent UUID",
      description: "The UUID of the respondent",
    },
    itemsPerPage: {
      type: "integer",
      label: "Items Per Page",
      description: "The number of items to display per page in the response. The minimum value is `1`, and the maximum is `100`.",
      optional: true,
      min: 1,
      max: 100,
    },
    start: {
      type: "string",
      label: "Start",
      description: "The start timestamp to filter surveys by their creation date. Surveys are ordered from latest to oldest. Thus, surveys created before or at this timestamp will be included in the response. The timestamp should be in the ISO 8601 format, including microseconds (e.g., `2023-01-01T00:00:00.000000Z`).",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "The end timestamp to filter surveys by their creation date. Surveys are ordered from latest to oldest. Thus, surveys created on or after this timestamp will be included in the response. The timestamp should be in the ISO 8601 format, including microseconds (e.g., `2023-01-01T00:00:00.000000Z`).",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    _headers() {
      return {
        "Authorization": `Basic ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this._headers(),
        ...args,
      });
    },
    async listSurveys(args = {}) {
      return this._makeRequest({
        path: "/surveys",
        ...args,
      });
    },
    async getSurvey({
      surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}`,
        ...args,
      });
    },
    async listQuestions({
      surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/questions`,
        ...args,
      });
    },
    async listResponses({
      surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/responses`,
        ...args,
      });
    },
    async getResponse({
      surveyId, responseId, ...args
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/responses/${responseId}`,
        ...args,
      });
    },
    async listRespondentAttributes({
      respondentUuid, ...args
    }) {
      return this._makeRequest({
        path: `/respondents/${respondentUuid}/attributes`,
        ...args,
      });
    },
    async listRespondentResponses({
      respondentUuid, ...args
    }) {
      return this._makeRequest({
        path: `/respondents/${respondentUuid}/responses`,
        ...args,
      });
    },
    async getPersonalDataCounters(args = {}) {
      return this._makeRequest({
        path: "/personal-data",
        ...args,
      });
    },
    async deletePersonalData(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/personal-data",
        ...args,
      });
    },
  },
};
