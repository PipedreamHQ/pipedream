import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "decision_journal",
  propDefinitions: {
    status: {
      type: "string",
      label: "Status",
      description: "The status of a decision or review",
      options: [
        "published",
        "draft",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the decision",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for a decision to organize",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "The context or background of the decision",
    },
    expectedOutcome: {
      type: "string",
      label: "Expected Outcome",
      description: "The expected outcome of the decision",
    },
    outcomeEstimates: {
      type: "string[]",
      label: "Outcome Estimates",
      description: "An array of outcome estimates in JSON string format. For each estimate, the format is `{\"text\": \"A description of an outcome estimate\", \"probability\": \"0.50\"}`",
      optional: true,
    },
    skillLuckWeight: {
      type: "string",
      label: "Skill-Luck Weight",
      description: "A number between `0` and `1` representing the weight of skill vs luck in the outcome",
      optional: true,
    },
    monthsToNextReview: {
      type: "integer",
      label: "Months to Next Review",
      description: "The number of months until the next review of the decision",
      options: [
        {
          label: "1 Month",
          value: 1,
        },
        {
          label: "3 Months",
          value: 3,
        },
        {
          label: "6 Months",
          value: 6,
        },
        {
          label: "1 Year",
          value: 12,
        },
      ],
    },
    decisionId: {
      type: "string",
      label: "Decision ID",
      description: "The unique identifier for a decision",
      async options() {
        const decisions = await this.listDecisions({
          params: {
            limit: constants.DEFAULT_LIMIT,
          },
        });
        return decisions.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    accuracyScore: {
      type: "integer",
      label: "Accuracy Score",
      description: "The accuracy score of the review. A number between `0` and `10`",
      min: 0,
      max: 10,
    },
    actualOutcome: {
      type: "string",
      label: "Actual Outcome",
      description: "The actual outcome of the decision",
    },
    learningsAndReview: {
      type: "string",
      label: "Learnings and Review",
      description: "The learnings and review notes",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const connfig = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, connfig);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "put",
        ...args,
      });
    },
    listDecisions(args = {}) {
      return this._makeRequest({
        path: "/decisions",
        ...args,
      });
    },
  },
};
