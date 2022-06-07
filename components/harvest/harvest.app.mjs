import constants from "./common/constants.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import retry from "async-retry";

export default {
  type: "app",
  app: "harvest",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to associate with the time entry",
      useQuery: true,
      async options({ page }) {
        const response = await this.listProjects({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
        });
        return response.projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to associate with the time entry",
      useQuery: true,
      async options({ page }) {
        const response = await this.listTasks({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
        });
        return response.tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to associate with the time entry",
      useQuery: true,
      optional: true,
      async options({ page }) {
        const response = await this.listUsers({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
        });
        return response.users.map((user) => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client to associate with time entries",
      useQuery: true,
      optional: true,
      async options({ page }) {
        const response = await this.listClients({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
        });
        return response.clients.map((client) => ({
          label: client.name,
          value: client.id,
        }));
      },
    },
    timeEntryId: {
      type: "string",
      label: "Time entry ID",
      description: "The ID of the time entry.",
      useQuery: true,
      async options({
        page, isRunning,
      }) {
        const response = await this.listTimeEntries({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
          is_running: isRunning,
        });
        return response.time_entries.map((entry) => ({
          label: `Project: ${entry.project.name}, Task: ${entry.task.name}, Spend date: ${entry.spent_date} ${entry.started_time || ""} ${entry.ended_time
            ? " to " + entry.ended_time
            : ""}`,
          value: entry.id,
        }));
      },
    },
  },
  methods: {
    setLastDateChecked(db, value) {
      db && db.set(constants.DB_LAST_DATE_CHECK, value);
    },
    getLastDateChecked(db) {
      return db && db.get(constants.DB_LAST_DATE_CHECK);
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Harvest-Account-Id": this.$auth.account_id,
      };
    },
    _getUrl(path) {
      const {
        BASE_URL,
        HTTP_PROTOCOL,
        VERSION_PATH,
      } = constants;
      return `${HTTP_PROTOCOL}${BASE_URL}${VERSION_PATH}${path}`;
    },
    async _makeRequest(args = {}) {
      const {
        $,
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    _isRetriableStatusCode(statusCode) {
      constants.retriableStatusCodes.includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          const data = await apiCall();

          return data;
        } catch (err) {
          const { status = 500 } = err;
          if (!this._isRetriableStatusCode(status)) {
            bail(`
              Unexpected error (status code: ${status}):
              ${JSON.stringify(err.response)}
            `);
          }
          throw new ConfigurationError("Could not get data");
        }
      }, retryOpts);
    },
    async *listTimeEntriesPaginated({
      page, updatedSince,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listTimeEntries({
            per_page: constants.PAGE_SIZE,
            page,
            updated_since: updatedSince,
          }),
        );

        if (response.time_entries.length === 0) {
          return;
        }
        for (const entry of response.time_entries) {
          yield entry;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async *listInvoicesPaginated({
      page, updatedSince,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listInvoices({
            per_page: constants.PAGE_SIZE,
            page,
            updated_since: updatedSince,
          }),
        );

        if (response.invoices.length === 0) {
          return;
        }
        for (const invoice of response.invoices) {
          yield invoice;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async listProjects({
      $, perPage, page,
    }) {
      return this._makeRequest({
        $,
        path: "/projects",
        params: {
          per_page: perPage,
          page,
        },
      });
    },
    async listTasks({
      $, perPage, page,
    }) {
      return this._makeRequest({
        $,
        path: "/tasks",
        params: {
          per_page: perPage,
          page,
        },
      });
    },
    async listUsers({
      $, perPage, page,
    }) {
      return this._makeRequest({
        $,
        path: "/users",
        params: {
          per_page: perPage,
          page,
        },
      });
    },
    async listClients({
      $, perPage, page,
    }) {
      return this._makeRequest({
        $,
        path: "/clients",
        params: {
          per_page: perPage,
          page,
        },
      });
    },
    async createTimeEntry({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/time_entries",
        params,
        method: "post",
      });
    },
    async listTimeEntries({
      $, ...params
    }) {

      return this._makeRequest({
        $,
        path: "/time_entries",
        params,
      });
    },
    async restartTimeEntry({
      $, id,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}/restart`,
        method: "patch",
      });
    },
    async stopTimeEntry({
      $, id,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}/stop`,
        method: "patch",
      });
    },
    async listInvoices({
      $, ...params
    }) {
      return this._makeRequest({
        $,
        path: "/invoices",
        params,
      });
    },
  },
};
