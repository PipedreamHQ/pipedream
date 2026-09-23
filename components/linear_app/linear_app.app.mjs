import { LinearClient } from "@linear/sdk";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "linear_app",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team",
      description: "The team's `id` as returned by the Linear API — a UUID such as `9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f`. The short team key shown in issue identifiers such as `ENG-123` is rejected. Use **Get Teams** to discover valid team IDs.",
    },
    issueId: {
      type: "string",
      label: "Issue",
      description: "The ID of the issue (a UUID). Use **Search Issues** to find issues and retrieve their IDs.",
    },
    issueIdentifier: {
      type: "string",
      label: "Issue Identifier",
      description: "The human-readable identifier of the issue. Example: `APP-1234` or `ENG-99`. Use **Search Issues** to find valid identifiers.",
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The UUID of the project (e.g. `a1b2c3d4-0000-0000-0000-000000000001`). Use **List Projects** to find valid project IDs.",
      optional: true,
    },
    issueTitle: {
      type: "string",
      label: "Title",
      description: "The title of the issue.",
    },
    assigneeId: {
      type: "string",
      label: "Assignee",
      description: "The UUID of the user to assign (e.g. `abc12345-0000-0000-0000-000000000001`). Use **List Users** to discover valid user IDs.",
      optional: true,
    },
    stateId: {
      type: "string",
      label: "State (Status)",
      description: "The UUID of the workflow state (status) to assign to the issue. Use **List Workflow States** to find valid state IDs.",
      optional: true,
    },
    issueDescription: {
      type: "string",
      label: "Description",
      description: "The issue description in markdown format",
      optional: true,
    },
    issueLabelNames: {
      type: "string[]",
      label: "Issue Labels",
      description: "The label names to filter issues by (e.g. `[\"Bug\", \"Frontend\"]`). Use **List Labels** to find valid label names.",
      optional: true,
    },
    issueLabelIds: {
      type: "string[]",
      label: "Label IDs",
      description: "The UUIDs of the labels to apply to the issue (e.g. `[\"lbl1b2c3d4-0000-0000-0000-000000000001\"]`). Use **List Labels** to find valid label IDs.",
      optional: true,
    },
    projectStatusId: {
      type: "string",
      label: "Status ID",
      description: "The UUID of the project status (e.g. `s1b2c3d4-0000-0000-0000-000000000001`). Use **List Project Statuses** to find valid status IDs.",
      optional: true,
    },
    projectLabelIds: {
      type: "string[]",
      label: "Label IDs",
      description: "The UUIDs of the project labels to apply (e.g. `[\"pl1b2c3d4-0000-0000-0000-000000000001\"]`). Use **List Project Labels** to find valid label IDs.",
      optional: true,
    },
    initiativeId: {
      type: "string",
      label: "Initiative",
      description: "The UUID of the initiative (e.g. `b2c3d4e5-0000-0000-0000-000000000002`). Use **List Initiatives** to find valid initiative IDs.",
    },
    customViewId: {
      type: "string",
      label: "Custom View",
      description: "The UUID of the custom view (e.g. `cv1b2c3d4-0000-0000-0000-000000000001`). Use **List Views** to find valid view IDs.",
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
    initiativeStatus: {
      type: "string",
      label: "Status",
      description: "The status of the initiative",
      optional: true,
      options: [
        "Active",
        "Completed",
        "Planned",
      ],
    },
    targetDate: {
      type: "string",
      label: "Target Date",
      description: "The target date of the initiative in ISO 8601 format",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search string to look for in issue titles. The query is used to filter issues where the title contains the query text (case insensitive).",
      optional: true,
    },
    updateBody: {
      type: "string",
      label: "Body",
      description: "The content of the update in markdown format.",
    },
    health: {
      type: "string",
      label: "Health",
      description: "The health status of the update. One of: `onTrack` (On Track), `atRisk` (At Risk), `offTrack` (Off Track).",
      optional: true,
      options: constants.HEALTH_OPTIONS,
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
    /**
     * Runs a GraphQL query. Linear answers a rejected one with HTTP 200, a null
     * `data` and a populated `errors` array, so axios reports success and the
     * failure surfaces only here.
     *
     * @param {object} [args] - axios options, carrying `data.query` and
     * `data.variables`
     * @returns {Promise<object>} the response body, `data` guaranteed present
     * @throws {ConfigurationError} when Linear marks every error as one the
     * caller can fix, which stops the workflow instead of retrying it
     * @throws {Error} on any other failure, leaving a rate limit or a server
     * fault retryable
     */
    async post(args = {}) {
      const response = await this.makeAxiosRequest({
        method: "POST",
        ...args,
      });
      const {
        data, errors,
      } = response ?? {};
      if (errors?.length) {
        const message = utils.formatGraphQlErrors(errors);
        if (errors.every(({ extensions }) => extensions?.userError)) {
          throw new ConfigurationError(message);
        }
        throw new Error(message);
      }
      if (!data) {
        throw new Error("The Linear API returned an empty response");
      }
      return response;
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
    async createComment(input) {
      return this.client().createComment(input);
    },
    async createInitiative(input) {
      return this.client().createInitiative(input);
    },
    async createProjectUpdate(input) {
      return this.client().createProjectUpdate(input);
    },
    async createInitiativeUpdate(input) {
      return this.client().createInitiativeUpdate(input);
    },
    async updateInitiative(initiativeId, input) {
      return this.client().updateInitiative(initiativeId, input);
    },
    async removeLabelFromIssue(issueId, labelId) {
      return this.client().issueRemoveLabel(issueId, labelId);
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
    async getCustomView(id) {
      return this.client().customView(id);
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
    async listInitiativeUpdates(variables) {
      const { data: { initiativeUpdates } } = await this.post({
        data: {
          query: queries.listInitiativeUpdates,
          variables,
        },
      });
      return initiativeUpdates;
    },
    async getInitiativeUpdateGraphQL(id) {
      const { data: { initiativeUpdate } } = await this.post({
        data: {
          query: queries.getInitiativeUpdate,
          variables: {
            initiativeUpdateId: id,
          },
        },
      });
      return initiativeUpdate;
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
    async listCustomViews(variables = {}) {
      return this.client().customViews(variables);
    },
    async listInitiatives(variables = {}) {
      return this.client().initiatives(variables);
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
