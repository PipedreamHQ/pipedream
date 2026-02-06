import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "float",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client",
      description: "The client to use",
      async options({ page }) {
        const clients = await this.listClients({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return clients.map((c) => ({
          value: c.client_id,
          label: c.name,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tag to use",
      async options({ page }) {
        const tags = await this.listTags({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return tags.map((t) => t.name);
      },
    },
    accountId: {
      type: "string",
      label: "Account",
      description: "The account to use",
      async options({ page }) {
        const accounts = await this.listAccounts({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return accounts.map((a) => ({
          value: a.account_id,
          label: `${a.name} (${a.email})`,
        }));
      },
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "The ID of the project stage for this project. This field takes precedence over `Status` when both are provided. If omitted, the first available stage related to the project's `Status` will be used",
      async options({ page }) {
        const stages = await this.listStages({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return stages.map((s) => ({
          value: s.id,
          label: s.name,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project",
      description: "The project to use",
      async options({ page }) {
        const projects = await this.listProjects({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return projects.map((p) => ({
          value: p.project_id,
          label: p.name,
        }));
      },
    },
    phaseId: {
      type: "integer",
      label: "Phase",
      description: "The phase to use",
      async options({
        page, projectId,
      }) {
        const phases = await this.listPhases({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
            "project_id": projectId,
          },
        });
        return phases.map((p) => ({
          value: p.phase_id,
          label: p.name,
        }));
      },
    },
    peopleId: {
      type: "string",
      label: "Person",
      description: "The person (team member) to assign",
      async options({ page }) {
        const people = await this.listPeople({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return people.map((p) => ({
          value: p.people_id,
          label: `${p.name} (${p.email})`,
        }));
      },
    },
    taskId: {
      type: "integer",
      label: "Task",
      description: "The task (allocation) to update",
      async options({ page }) {
        const tasks = await this.listTasks({
          params: {
            "page": page + 1,
            "per-page": LIMIT,
          },
        });
        return tasks.map((t) => ({
          value: t.task_meta_id,
          label: t.task_name,
        }));
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the project task, an empty string is valid and is the default on the UI when a project task has not been chosen",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Billable project tasks may not belong to non-billable projects or phases",
      optional: true,
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "The budget amount for 'hours by task' or 'fee by task' project budgets",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return "https://api.float.com/v3";
    },
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "User-Agent": "Pipedream (support@pipedream.com)",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this.getBaseUrl()}${path}`,
        headers: this.getHeaders(),
        ...opts,
      });
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listStages(opts = {}) {
      return this._makeRequest({
        path: "/project-stages",
        ...opts,
      });
    },
    listPhases(opts = {}) {
      return this._makeRequest({
        path: "/phases",
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "POST",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        path: "/project-tasks",
        method: "POST",
        ...opts,
      });
    },
    updateTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/project-tasks/${taskId}`,
        method: "PATCH",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listLoggedTime(opts = {}) {
      return this._makeRequest({
        path: "/logged-time",
        ...opts,
      });
    },
    listPeople(opts = {}) {
      return this._makeRequest({
        path: "/people",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/project-tasks",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        params.per_page = LIMIT;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
