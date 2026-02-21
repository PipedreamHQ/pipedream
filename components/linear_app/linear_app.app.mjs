import { LinearClient } from "@linear/sdk";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";
import { axios } from "@pipedream/platform";
import queries from "./common/queries.mjs";

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
    issueIdentifier: {
      type: "string",
      label: "Issue Identifier",
      description: "The identifier of the issue. Example: `APP-1234`",
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
            identifier, title,
          }) => ({
            label: title,
            value: identifier,
          }),
        });
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The identifier or key of the project associated with the issue",
      optional: true,
      async options({
        teamId, prevContext,
      }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listProjects,
          resouceMapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          resourcesArgs: teamId && {
            filter: {
              accessibleTeams: {
                id: {
                  eq: teamId,
                },
              },
            },
          },
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
      async options({
        prevContext, byId = false,
      }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listIssueLabels,
          resouceMapper: ({
            id, name,
          }) => byId
            ? ({
              label: name,
              value: id,
            })
            : name,
        });
      },
    },
    projectStatusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the status of the project",
      optional: true,
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listProjectStatuses,
          resouceMapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    projectLabelIds: {
      type: "string[]",
      label: "Label IDs",
      description: "The IDs of the labels for the project",
      optional: true,
      async options({ prevContext }) {
        return this.listResourcesOptions({
          prevContext,
          resourcesFn: this.listProjectLabels,
          resouceMapper: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
        });
      },
    },
    projectPriority: {
      type: "integer",
      label: "Priority",
      description: "The priority of the project",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    issuePriority: {
      type: "integer",
      label: "Priority",
      description: "The priority of the issue",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search string to look for in issue titles. The query is used to filter issues where the title contains the query text (case insensitive).",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of issues to return. If no query is provided, this defaults to 20 to avoid returning too many results.",
      optional: true,
    },
  },
  methods: {
    getAxiosHeaders() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    makeAxiosRequest({
      $ = this, ...args
    }) {
      return axios($, {
        url: "https://api.linear.app/graphql",
        headers: this.getAxiosHeaders(),
        ...args,
      });
    },
    post(args = {}) {
      return this.makeAxiosRequest({
        method: "POST",
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
    async listIssues(variables) {
      const { data: { issues } } = await this.post({
        data: {
          query: queries.listIssues,
          variables,
        },
      });
      return issues;
    },
    async getIssue(variables) {
      const { data: { issue } } = await this.post({
        data: {
          query: queries.getIssue,
          variables,
        },
      });
      return issue;
    },
    async getUser(id) {
      return this.client().user(id);
    },
    async getProject(id) {
      return this.client().project(id);
    },
    async getProjectUpdate(id) {
      return this.client().projectUpdate(id);
    },
    async getProjectUpdateGraphQL(id) {
      const { data: { projectUpdate } } = await this.post({
        data: {
          query: queries.getProjectUpdate,
          variables: {
            projectUpdateId: id,
          },
        },
      });
      return projectUpdate;
    },
    async getState(id) {
      return this.client().workflowState(id);
    },
    async getTeam(id) {
      return this.client().team(id);
    },
    async listTeams(variables = {}) {
      return this.client().teams(variables);
    },
    async listProjects(variables) {
      const { data: { projects } } = await this.post({
        data: {
          query: queries.listProjects,
          variables,
        },
      });
      return projects;
    },
    async listProjectUpdates(variables) {
      const { data: { projectUpdates } } = await this.post({
        data: {
          query: queries.listProjectUpdates,
          variables,
        },
      });
      return projectUpdates;
    },
    async listUsers(variables = {}) {
      return this.client().users(variables);
    },
    async listStates(variables = {}) {
      return this.client().workflowStates(variables);
    },
    async listIssueLabels(variables = {}) {
      return this.client().issueLabels(variables);
    },
    async listComments(variables = {}) {
      return this.client().comments(variables);
    },
    async getComment(variables) {
      const { data: { comment } } = await this.post({
        data: {
          query: queries.getComment,
          variables,
        },
      });
      return comment;
    },
    async listProjectStatuses(variables = {}) {
      return this.client().projectStatuses(variables);
    },
    async listProjectLabels(variables = {}) {
      return this.client().projectLabels(variables);
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
      useGraphQl = true,
    }) {
      let counter = 0;
      let hasNextPage;
      let endCursor;
      do {
        const variables = useGraphQl
          ? utils.buildVariables(endCursor, resourcesFnArgs)
          : {
            after: endCursor,
            first: constants.DEFAULT_LIMIT,
            ...resourcesFnArgs,
          };
        const {
          nodes,
          pageInfo,
        } = await resourcesFn(variables);
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
