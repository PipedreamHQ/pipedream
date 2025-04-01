import { axios } from "@pipedream/platform";
import { MAX_PAGE_LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "brillium",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the Workspace the assessment resides within",
      async options({ page }) {
        try {
          const { Accounts: accounts } = await this.listAccounts({
            params: {
              page: page + 1,
            },
          });
          return accounts?.map(({
            Id: value, Name: label,
          }) => ({
            value,
            label: label === "N/A"
              ? value
              : label,
          })) || [];
        } catch {
          return [];
        }
      },
    },
    assessmentId: {
      type: "string",
      label: "Assessment ID",
      description: "The unique identifier for an assessment",
      async options({
        page, accountId,
      }) {
        try {
          const { Assessments: assessments } = await this.listAssessments({
            accountId,
            params: {
              page: page + 1,
            },
          });
          return assessments?.map(({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          })) || [];
        } catch {
          return [];
        }
      },
    },
    topicId: {
      type: "string",
      label: "Topic ID",
      description: "The unique identifier for a topic",
      async options({
        page, assessmentId,
      }) {
        try {
          const { QuestionGroups: topics } = await this.listTopics({
            assessmentId,
            params: {
              page: page + 1,
            },
          });
          return topics?.map(({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          })) || [];
        } catch {
          return [];
        }
      },
    },
    respondentId: {
      type: "string",
      label: "Respondent ID",
      description: "The unique identifier for a respondent",
      async options({
        page, accountId,
      }) {
        try {
          const { Respondents: respondents } = await this.listRespondents({
            accountId,
            params: {
              page: page + 1,
            },
          });
          return respondents?.map(({
            Id: value, FirstName: firstName, LastName: lastName,
          }) => ({
            value,
            label: (`${firstName} ${lastName}`).trim(),
          })) || [];
        } catch {
          return [];
        }
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to return. Default is `1`",
      default: 1,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of results to return. Must be between 1 - 1000. Default is `1000`",
      default: MAX_PAGE_LIMIT,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const base64Encoded = Buffer.from(`${this.$auth.api_key}:${this.$auth.api_password}`).toString("base64");
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Basic ${base64Encoded}`,
        },
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "Accounts",
        ...opts,
      });
    },
    listAssessments({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `Accounts/${accountId}/Assessments`,
        ...opts,
      });
    },
    listRespondents({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `Accounts/${accountId}/Respondents`,
        ...opts,
      });
    },
    listAssessmentRespondents({
      assessmentId, ...opts
    }) {
      return this._makeRequest({
        path: `Assessments/${assessmentId}/Respondents`,
        ...opts,
      });
    },
    listQuestions({
      assessmentId, ...opts
    }) {
      return this._makeRequest({
        path: `Assessments/${assessmentId}/Questions`,
        ...opts,
      });
    },
    listTopics({
      assessmentId, ...opts
    }) {
      return this._makeRequest({
        path: `Assessments/${assessmentId}/QuestionGroups`,
        ...opts,
      });
    },
    listTopicQuestions({
      topicId, ...opts
    }) {
      return this._makeRequest({
        path: `QuestionGroups/${topicId}/Questions`,
        ...opts,
      });
    },
    listRespondentResults({
      respondentId, ...opts
    }) {
      return this._makeRequest({
        path: `Respondents/${respondentId}/Results`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceKey,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
          pagesize: MAX_PAGE_LIMIT,
        },
      };
      let hasMore, count = 0;
      do {
        const response = await resourceFn(args);
        const items = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = response.HasMore;
        args.params.page++;
      } while (hasMore);
    },
  },
};
