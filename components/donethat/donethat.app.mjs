import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "donethat",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the DoneThat project, e.g. `project_123`."
        + " Use **List Projects** to find it (the `id` field).",
      async options() {
        const { projects = [] } = await this.listProjects({
          params: {
            includeArchived: true,
          },
        });
        return projects.map(({
          id: value, name, status,
        }) => ({
          value,
          label: status === "archived"
            ? `${name} (archived)`
            : name,
        }));
      },
    },
    projectIds: {
      type: "string[]",
      label: "Project IDs",
      description: "Only include work on these projects, e.g. `[\"project_123\", \"project_456\"]`."
        + " Use **List Projects** to find project IDs (the `id` field).",
      optional: true,
      async options() {
        const { projects = [] } = await this.listProjects({
          params: {
            includeArchived: true,
          },
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    summaryFormat: {
      type: "string",
      label: "Format",
      description: "Output format of the summary `content`. One of `text`, `html`, `slack` (an array of Slack Block Kit blocks) or `discord` (a single Discord embed object), e.g. `text`.",
      options: constants.SUMMARY_FORMATS,
      default: "text",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The project name, max 100 characters, e.g. `Customer onboarding`.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The project description, max 2000 characters, e.g. `Implementation work for new customers`.",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The project color. Must be one of DoneThat's 20 palette hex values, e.g. `#FFB623`.",
      options: constants.PROJECT_COLORS,
      optional: true,
    },
    team: {
      type: "string",
      label: "Team",
      description: "Make this a team project: a team ID or the exact, case-sensitive team name you have access to, e.g. `Backend`."
        + " Team IDs appear as the `teamId` field in **List Projects**.",
      optional: true,
    },
    portfolio: {
      type: "string",
      label: "Portfolio",
      description: "A portfolio ID or the exact, case-sensitive portfolio name you have access to, e.g. `Platform`."
        + " Portfolio IDs appear as the `portfolioId` field in **List Projects**.",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Private",
      description: "Whether the project is private, e.g. `false`.",
      optional: true,
    },
    contributorAccess: {
      type: "string",
      label: "Contributor Access",
      description: "Who can log time to a team project. `everyone` lets every member of the project's team log time;"
        + " `selected` limits it to the people in Contributors, and nobody can log time if Contributors is empty."
        + " Only valid on team projects.",
      options: constants.CONTRIBUTOR_ACCESS_OPTIONS,
      optional: true,
    },
    contributorIds: {
      type: "string[]",
      label: "Contributors",
      description: "The people who can log time when Contributor Access is `selected`: user IDs, handles (without the `@`) or email addresses, e.g. `[\"jane@example.com\"]`."
        + " Every entry must be an active member of the project's team."
        + " In DoneThat, a member's handle shows as `@handle` under their name in the group's Settings > Members (groups are teams in the API); you can also use the email address they sign in with."
        + " Setting Contributors without Contributor Access is the same as `selected`, and replaces the whole list.",
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: constants.BASE_URL,
        headers: {
          "x-api-key": this.$auth.api_key,
          ...headers,
        },
        ...args,
      });
    },
    getReport(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/report",
        ...args,
      });
    },
    getSummary(args = {}) {
      return this._makeRequest({
        url: "/message",
        ...args,
      });
    },
    searchWork(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/search",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        url: "/projects",
        ...args,
      });
    },
    createProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/projects",
        ...args,
      });
    },
    updateProject({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/projects/${encodeURIComponent(projectId)}`,
        ...args,
      });
    },
  },
};
