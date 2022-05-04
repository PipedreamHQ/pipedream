import { LinearClient } from "@linear/sdk";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "linear_app",
  propDefinitions: {
    issueId: {
      type: "string",
      label: "Issue ID",
      description: "The issue ID to update",
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listIssues,
          resouceMapper: ({
            id, title,
          }) => ({
            label: title,
            value: id,
          }),
        });
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The identifier or key of the team associated with the issue.",
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listTeams,
          resouceMapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
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
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listUsers,
          resouceMapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
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
      description: "By which field should the pagination order by. Available options are `createdAt` (default) and `updatedAt`.",
      optional: true,
      options: constants.ORDER_BY_OPTIONS,
    },
    after: {
      type: "string",
      label: "After",
      description: "A cursor to be used with **First** for forward pagination.",
      optional: true,
    },
    first: {
      type: "integer",
      label: "First",
      description: "The number of items to forward paginate (used with **After**). Defaults to `50`.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "A cursor to be used with **Last** for backward pagination.",
      optional: true,
    },
    last: {
      type: "integer",
      label: "Last",
      description: "The number of items to backward paginate (used with **Before**). Defaults to `50`.",
      optional: true,
    },
    includeArchived: {
      type: "boolean",
      label: "Include archived",
      description: "Should archived resources be included (default: `false`).",
      optional: true,
    },
  },
  methods: {
    getClientOptions(options = {}) {
      return {
        apiKey: this.$auth.api_key,
        ...options,
      };
    },
    client(options = {}) {
      return new LinearClient(this.getClientOptions(options));
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
      issueId, input,
    }) {
      return this.client().issueUpdate(issueId, input);
    },
    async searchIssues({
      query, variables,
    }) {
      return this.client().issueSearch(query, variables);
    },
    async listTeams(variables = {}) {
      return this.client().teams(variables);
    },
    async listUsers(variables = {}) {
      return this.client().users(variables);
    },
    async listIssues(variables = {}) {
      return this.client().issues(variables);
    },
    async listResourcesOptions({
      prevContext, resourcesFn, resouceMapper,
    }) {
      const {
        after,
        hasNextPage,
      } = prevContext;

      if (hasNextPage === false) {
        return [];
      }

      const {
        nodes,
        pageInfo,
      } =
        await resourcesFn({
          after,
          first: constants.DEFAULT_LIMIT,
        });

      return {
        options: nodes.map(resouceMapper),
        context: {
          after: pageInfo.endCursor,
          hasNextPage: pageInfo.hasNextPage,
        },
      };
    },
  },
};
