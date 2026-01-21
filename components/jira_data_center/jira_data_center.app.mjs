import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "jira_data_center",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board",
      async options() {
        const { values: boards } = await this.listBoards();
        return boards.map((board) => ({
          label: board.name,
          value: board.id,
        }));
      },
    },
    resolutionId: {
      type: "string",
      label: "Resolution ID",
      description: "The ID of the resolution",
      async options() {
        const resolutions = await this.listResolutions();
        return resolutions.map((resolution) => ({
          label: resolution.name,
          value: resolution.id,
        }));
      },
    },
    sprintId: {
      type: "string",
      label: "Sprint ID",
      description: "The ID of the sprint",
      async options({
        boardId, excludeClosed = false, page,
      }) {
        if (!boardId) {
          return [];
        }
        let { values: sprints } = await this.listSprints({
          boardId,
          params: {
            maxResults: DEFAULT_LIMIT,
            startAt: page * DEFAULT_LIMIT,
          },
        });
        if (excludeClosed) {
          sprints = sprints.filter((sprint) => sprint.state !== "closed");
        }
        return sprints.map((sprint) => ({
          label: sprint.name,
          value: sprint.id,
        }));
      },
    },
    issueId: {
      type: "string",
      label: "Issue ID",
      description: "The ID of the issue",
      async options({
        boardId, page,
      }) {
        if (!boardId) {
          return [];
        }
        const { issues } = await this.listBoardIssues({
          boardId,
          params: {
            maxResults: DEFAULT_LIMIT,
            startAt: page * DEFAULT_LIMIT,
          },
        });
        return issues.map((issue) => ({
          label: issue.key,
          value: issue.id,
        }));
      },
    },
    filterId: {
      type: "string",
      label: "Filter ID",
      description: "The ID of the filter",
      async options() {
        const filters = await this.listFavoriteFilters();
        return filters.map((filter) => ({
          label: filter.name,
          value: filter.id,
        }));
      },
    },
    worklogIds: {
      type: "string[]",
      label: "Worklog IDs",
      description: "The IDs of the worklogs to get",
      async options() {
        const { values } = await this.getUpdatedWorkLogs({
          params: {
            since: 0,
          },
        });
        return values.map(({ worklogId }) => worklogId);
      },
    },
    epicId: {
      type: "string",
      label: "Epic ID",
      description: "The ID of the epic",
      async options({
        boardId, page,
      }) {
        if (!boardId) {
          return [];
        }
        const { values } = await this.listEpics({
          boardId,
          params: {
            maxResults: DEFAULT_LIMIT,
            startAt: page * DEFAULT_LIMIT,
          },
        });
        return values.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the sprint",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the sprint. Format: `YYYY-MM-DDTHH:MM:SS.SSSZ`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the sprint. Format: `YYYY-MM-DDTHH:MM:SS.SSSZ`",
    },
    autoStartStop: {
      type: "boolean",
      label: "Auto Start Stop",
      description: "Whether to automatically start and stop the sprint",
      optional: true,
    },
    goal: {
      type: "string",
      label: "Goal",
      description: "The goal of the sprint",
      optional: true,
    },
    synced: {
      type: "boolean",
      label: "Synced",
      description: "Whether the sprint is synced. Only Jira administrators can create synced sprints.",
      optional: true,
    },
    activatedDate: {
      type: "string",
      label: "Activated Date",
      description: "The activated date of the sprint. Format: `YYYY-MM-DDTHH:MM:SS.SSSZ`",
      optional: true,
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "The completed date of the sprint. Format: `YYYY-MM-DDTHH:MM:SS.SSSZ`",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the sprint",
      options: [
        "future",
        "active",
        "closed",
      ],
    },
    jql: {
      type: "string",
      label: "JQL Query",
      description: "A JQL query. [See the documentation for syntax and examples](https://support.atlassian.com/jira-software-cloud/docs/what-is-advanced-search-in-jira-cloud/)",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 25,
      optional: true,
    },
    startAt: {
      type: "integer",
      label: "Start At",
      description: "The index of the first result to return",
      default: 0,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/rest`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.personal_access_token}`,
        },
        ...opts,
      });
    },
    getBoard({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}`,
        ...opts,
      });
    },
    getResolution({
      resolutionId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/2/resolution/${resolutionId}`,
        ...opts,
      });
    },
    getSprint({
      sprintId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/sprint/${sprintId}`,
        ...opts,
      });
    },
    getUpdatedWorkLogs(opts = {}) {
      return this._makeRequest({
        path: "/api/2/worklog/updated",
        ...opts,
      });
    },
    getIssuesFromBacklog({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}/backlog`,
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/api/2/project",
        ...opts,
      });
    },
    listBoards(opts = {}) {
      return this._makeRequest({
        path: "/agile/1.0/board",
        ...opts,
      });
    },
    listResolutions(opts = {}) {
      return this._makeRequest({
        path: "/api/2/resolution",
        ...opts,
      });
    },
    listWorklogsById(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/2/worklog/list",
        ...opts,
      });
    },
    listSprints({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}/sprint`,
        ...opts,
      });
    },
    listBoardIssues({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}/issue`,
        ...opts,
      });
    },
    listSprintIssues({
      sprintId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/sprint/${sprintId}/issue`,
        ...opts,
      });
    },
    listEpics({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}/epic`,
        ...opts,
      });
    },
    listIssuesWithoutEpic({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}/epic/none/issue`,
        ...opts,
      });
    },
    listEpicIssues({
      boardId, epicId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}/epic/${epicId}/issue`,
        ...opts,
      });
    },
    listFavoriteFilters(opts = {}) {
      return this._makeRequest({
        path: "/api/2/filter/favourite",
        ...opts,
      });
    },
    createFilter(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/2/filter",
        ...opts,
      });
    },
    createBoard(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agile/1.0/board",
        ...opts,
      });
    },
    createFutureSprint(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agile/1.0/sprint",
        ...opts,
      });
    },
    updateSprint({
      sprintId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/agile/1.0/sprint/${sprintId}`,
        ...opts,
      });
    },
    updateSprintPartial({
      sprintId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agile/1.0/sprint/${sprintId}`,
        ...opts,
      });
    },
    moveIssuesToSprint({
      sprintId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agile/1.0/sprint/${sprintId}/issue`,
        ...opts,
      });
    },
    moveIssuesToBacklog(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agile/1.0/backlog/issue",
        ...opts,
      });
    },
    deleteSprint({
      sprintId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/agile/1.0/sprint/${sprintId}`,
        ...opts,
      });
    },
  },
};
