import { LinearClient } from "@linear/sdk";
import constants from "./common/constants.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linear_app",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team",
      description: "The identifier or key of the team associated with the issue",
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
    issueId: {
      type: "string",
      label: "Issue",
      description: "The issue to update",
      async options({
        teamId, prevContext,
      }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listIssues,
          resourcesArgs: teamId && {
            filter: {
              team: {
                id: {
                  eq: teamId,
                },
              },
            },
          },
          resouceMapper: ({
            id, title,
          }) => ({
            label: title,
            value: id,
          }),
        });
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The identifier or key of the project associated with the issue",
      optional: true,
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listProjects,
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
      label: "Assignee",
      description: "The user to assign to the issue",
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
    stateId: {
      type: "string",
      label: "State (Status)",
      description: "The state (status) to assign to the issue",
      optional: true,
      async options({
        teamId, prevContext,
      }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listStates,
          resourcesArgs: teamId && {
            filter: {
              team: {
                id: {
                  eq: teamId,
                },
              },
            },
          },
          resouceMapper: ({
            id: value, name: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    boardOrder: {
      type: "string",
      label: "Board order",
      description: "The position of the issue in its column on the board view",
      optional: true,
    },
    issueDescription: {
      type: "string",
      label: "Description",
      description: "The issue description in markdown format",
      optional: true,
    },
    issueLabels: {
      type: "string[]",
      label: "Issue Labels",
      description: "The labels in the issue",
      optional: true,
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listIssueLabels,
          resouceMapper: ({ name }) => name,
        });
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search string to look for",
    },
    orderBy: {
      type: "string",
      label: "Order by",
      description: "By which field should the pagination order by. Available options are `createdAt` (default) and `updatedAt`.",
      optional: true,
      options: constants.ORDER_BY_OPTIONS,
    },
    includeArchived: {
      type: "boolean",
      label: "Include archived",
      description: "Should archived resources be included? (default: `false`)",
      optional: true,
    },
  },
  methods: {
    getAxiosHeaders() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    async makeAxiosRequest({
      $ = this, ...args
    }) {
      return axios($, {
        url: "https://api.linear.app/graphql",
        headers: this.getAxiosHeaders(),
        ...args,
      });
    },
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
      return this.client().createWebhook(input);
    },
    async deleteWebhook(id) {
      return this.client().deleteWebhook(id);
    },
    async createIssue(input) {
      return this.client().createIssue(input);
    },
    async updateIssue({
      issueId, input,
    }) {
      return this.client().updateIssue(issueId, input);
    },
    async searchIssues(variables) {
      return this.client().issues(variables);
    },
    async getIssue(id) {
      return this.client().issue(id);
    },
    async listTeams(variables = {}) {
      return this.client().teams(variables);
    },
    async listProjects() {
      const { data: { projects } } = await this.makeAxiosRequest({
        method: "POST",
        data: {
          query: "{ projects { nodes { id name } } }",
        },
      });
      return projects;
    },
    async listUsers(variables = {}) {
      return this.client().users(variables);
    },
    async listStates(variables = {}) {
      return this.client().workflowStates(variables);
    },
    async listIssues(variables = {}) {
      return this.client().issues(variables);
    },
    async listIssueLabels(variables = {}) {
      return this.client().issueLabels(variables);
    },
    async listComments(variables = {}) {
      return this.client().comments(variables);
    },
    async listResourcesOptions({
      prevContext, resourcesFn, resourcesArgs, resouceMapper,
    } = {}) {
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
          ...resourcesArgs,
        });

      return {
        options: nodes.map(resouceMapper),
        context: {
          after: pageInfo?.endCursor,
          hasNextPage: pageInfo?.hasNextPage,
        },
      };
    },
    async *paginateResources({
      resourcesFn,
      resourcesFnArgs,
      max = constants.DEFAULT_MAX_RECORDS,
    }) {
      let counter = 0;
      let hasNextPage;
      let endCursor;
      do {
        const {
          nodes,
          pageInfo,
        } = await resourcesFn({
          after: endCursor,
          first: constants.DEFAULT_LIMIT,
          ...resourcesFnArgs,
        });
        for (const node of nodes) {
          counter += 1;
          yield node;
        }
        ({
          hasNextPage, endCursor,
        } = pageInfo);
      } while (hasNextPage && counter < max);
    },
  },
};
