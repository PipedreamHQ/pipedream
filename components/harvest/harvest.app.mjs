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
      async options({
        page, accountId,
      }) {
        const response = await this.listProjects({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
          accountId,
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
      async options({
        page, accountId,
      }) {
        const response = await this.listTasks({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
          accountId,
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
      async options({
        page, accountId,
      }) {
        const response = await this.listUsers({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
          accountId,
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
      async options({
        page, accountId,
      }) {
        const response = await this.listClients({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
          accountId,
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
        page, isRunning, accountId,
      }) {
        const response = await this.listTimeEntries({
          perPage: constants.PAGE_SIZE,
          page: page + 1,
          is_running: isRunning,
          accountId,
        });
        return response.time_entries.map((entry) => ({
          label: `Project: ${entry.project.name}, Task: ${entry.task.name}, Spend date: ${entry.spent_date} ${entry.started_time || ""} ${entry.ended_time
            ? " to " + entry.ended_time
            : ""}`,
          value: entry.id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of your account",
      async options() {
        const { accounts } = await this.listAccounts({});
        return accounts.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
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
    _getAuthorizationHeader() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getHeaders(accountId) {
      return {
        "Content-Type": "application/json",
        "Harvest-Account-Id": accountId,
        ...this._getAuthorizationHeader(),
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
        accountId,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(accountId),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    async listAccounts({ $ = this }) {
      return axios($, {
        url: "https://id.getharvest.com/api/v2/accounts",
        headers: this._getAuthorizationHeader(),
      });
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
      page, updatedSince, accountId,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listTimeEntries({
            per_page: constants.PAGE_SIZE,
            page,
            updated_since: updatedSince,
            accountId,
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
      page, updatedSince, accountId,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listInvoices({
            per_page: constants.PAGE_SIZE,
            page,
            updated_since: updatedSince,
            accountId,
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
    async *listProjectsPaginated({
      page, $, accountId,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listProjects({
            accountId,
            per_page: constants.PAGE_SIZE,
            page,
            $,
          }),
        );

        if (response.projects.length === 0) {
          return;
        }
        for (const project of response.projects) {
          yield project;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async getProject({
      $, projectId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}`,
        accountId,
      });
    },
    async listProjects({
      $, perPage, page, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/projects",
        params: {
          per_page: perPage,
          page,
        },
        accountId,
      });
    },
    async listTasks({
      $, perPage, page, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/tasks",
        params: {
          per_page: perPage,
          page,
        },
        accountId,
      });
    },
    async listUsers({
      $, perPage, page, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/users",
        params: {
          per_page: perPage,
          page,
        },
        accountId,
      });
    },
    async listClients({
      $, perPage, page, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/clients",
        params: {
          per_page: perPage,
          page,
        },
        accountId,
      });
    },
    async createTimeEntry({
      $, params, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/time_entries",
        params,
        method: "post",
        accountId,
      });
    },
    async listTimeEntries({
      $, accountId, ...params
    }) {

      return this._makeRequest({
        $,
        path: "/time_entries",
        accountId,
        params,
      });
    },
    async restartTimeEntry({
      $, id, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}/restart`,
        method: "patch",
        accountId,
      });
    },
    async stopTimeEntry({
      $, id, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}/stop`,
        method: "patch",
        accountId,
      });
    },
    async listInvoices({
      $, accountId, ...params
    }) {
      return this._makeRequest({
        $,
        path: "/invoices",
        accountId,
        params,
      });
    },
  },
};
