import { LinearClient } from "@linear/sdk";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "linear_app",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The identifier or key of the team associated with the issue.",
    },
    issueTitle: {
      type: "string",
      label: "Title",
      description: "The title of the issue.",
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The identifier of the user to assign the issue to.",
      optional: true,
    },
    boardOrder: {
      type: "string",
      label: "Board order",
      description: "The position of the issue in its column on the board view.",
      optional: true,
    },
    issueDescription: {
      type: "string",
      label: "Description",
      description: "The issue description in markdown format.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search string to look for.",
    },
    orderBy: {
      type: "string",
      label: "Order by",
      description: "By which field should the pagination order by. Available options are createdAt (default) and updatedAt.",
      options: constants.ORDER_BY_OPTIONS,
      default: constants.FIELD.CREATED_AT,
    },
    // """
    // A cursor to be used with first for forward pagination
    // """
    // after: String
    // """
    // A cursor to be used with last for backward pagination.
    // """
    // before: String
    // """
    // [Alpha] Filter returned issues.
    // """
    // filter: IssueFilter
    // """
    // The number of items to forward paginate (used with after). Defaults to 50.
    // """
    // first: Int
    // """
    // Should archived resources be included (default: false)
    // """
    // includeArchived: Boolean
    // """
    // The number of items to backward paginate (used with before). Defaults to 50.
    // """
    // last: Int
  },
  methods: {
    client({ options } = {}) {
      return new LinearClient({
        apiKey: this.$auth.api_key,
        ...options,
      });
    },
    async createWebhook(input) {
      return this.client().webhookCreate(input);
    },
    async deleteWebhook(id) {
      return this.client().webhookDelete(id);
    },
    async createIssue(input) {
      return this.client().issueCreate(input);
    },
    async updateIssue({
      id, input,
    }) {
      return this.client().issueUpdate(id, input);
    },
    async searchIssues({
      query, variables,
    }) {
      return this.client().issueSearch(query, variables);
    },
  },
};
