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
      description: "Free-form project ID, e.g. `14308069`. Run **Get Projects** first to find valid IDs.",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Free-form task ID, e.g. `1467097`. Run **List Tasks** first to find valid IDs.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Free-form user ID, e.g. `1782959`. Run **List Users** first to find valid IDs.",
      optional: true,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "Free-form client ID, e.g. `5735776`. Run **List Clients** first to find valid IDs.",
      optional: true,
    },
    timeEntryId: {
      type: "string",
      label: "Time Entry ID",
      description: "Free-form time entry ID, e.g. `636708723`. Run **List Time Entries** first to find valid IDs.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Free-form invoice ID, e.g. `13150403`. Run **List Invoices** first to find valid IDs.",
    },
    taskAssignmentId: {
      type: "string",
      label: "Task Assignment ID",
      description: "Free-form task assignment ID, e.g. `162728`. Run **List Task Assignments** first to find valid IDs.",
    },
    userAssignmentId: {
      type: "string",
      label: "User Assignment ID",
      description: "Free-form user assignment ID, e.g. `195420`. Run **List User Assignments** first to find valid IDs.",
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Your Harvest account ID, e.g. `1234567`. Run **List Account ID Options** to find it.",
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the record is active.",
      optional: true,
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "Only return records updated since this UTC datetime, e.g. `2019-06-25T15:30:00Z`.",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of records per page (1-100).",
      optional: true,
      min: 1,
      max: 100,
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
      return constants.RETRIABLE_STATUS_CODES.includes(statusCode);
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
      page, accountId, ...params
    }) {
      do {
        const response = await this._withRetries(
          () => this.listTimeEntries({
            per_page: constants.PAGE_SIZE,
            page,
            accountId,
            ...params,
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
      page, accountId, ...params
    }) {
      do {
        const response = await this._withRetries(
          () => this.listInvoices({
            per_page: constants.PAGE_SIZE,
            page,
            accountId,
            ...params,
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
    async *listClientsPaginated({
      page, accountId, isActive, updatedSince,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listClients({
            perPage: constants.PAGE_SIZE,
            page,
            accountId,
            isActive,
            updatedSince,
          }),
        );

        if (response.clients.length === 0) {
          return;
        }
        for (const client of response.clients) {
          yield client;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async *listTasksPaginated({
      page, accountId, isActive, updatedSince,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listTasks({
            perPage: constants.PAGE_SIZE,
            page,
            accountId,
            isActive,
            updatedSince,
          }),
        );

        if (response.tasks.length === 0) {
          return;
        }
        for (const task of response.tasks) {
          yield task;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async *listUsersPaginated({
      page, accountId, isActive, updatedSince,
    }) {
      do {
        const response = await this._withRetries(
          () => this.listUsers({
            perPage: constants.PAGE_SIZE,
            page,
            accountId,
            isActive,
            updatedSince,
          }),
        );

        if (response.users.length === 0) {
          return;
        }
        for (const user of response.users) {
          yield user;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async *listTaskAssignmentsPaginated({
      page, accountId, ...params
    }) {
      do {
        const response = await this._withRetries(
          () => this.listTaskAssignments({
            per_page: constants.PAGE_SIZE,
            page,
            accountId,
            ...params,
          }),
        );

        if (response.task_assignments.length === 0) {
          return;
        }
        for (const assignment of response.task_assignments) {
          yield assignment;
        }
        if (!response.next_page) {
          return;
        }
        page += 1;
      } while (true);
    },
    async *listUserAssignmentsPaginated({
      page, accountId, ...params
    }) {
      do {
        const response = await this._withRetries(
          () => this.listUserAssignments({
            per_page: constants.PAGE_SIZE,
            page,
            accountId,
            ...params,
          }),
        );

        if (response.user_assignments.length === 0) {
          return;
        }
        for (const assignment of response.user_assignments) {
          yield assignment;
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
      $, perPage, page, accountId, isActive, updatedSince,
    }) {
      return this._makeRequest({
        $,
        path: "/tasks",
        params: {
          per_page: perPage,
          page,
          is_active: isActive,
          updated_since: updatedSince,
        },
        accountId,
      });
    },
    async listUsers({
      $, perPage, page, accountId, isActive, updatedSince,
    }) {
      return this._makeRequest({
        $,
        path: "/users",
        params: {
          per_page: perPage,
          page,
          is_active: isActive,
          updated_since: updatedSince,
        },
        accountId,
      });
    },
    async listClients({
      $, perPage, page, accountId, isActive, updatedSince,
    }) {
      return this._makeRequest({
        $,
        path: "/clients",
        params: {
          per_page: perPage,
          page,
          is_active: isActive,
          updated_since: updatedSince,
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
    async getTimeEntry({
      $, id, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}`,
        accountId,
      });
    },
    async updateTimeEntry({
      $, id, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}`,
        method: "patch",
        data,
        accountId,
      });
    },
    async deleteTimeEntry({
      $, id, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/time_entries/${id}`,
        method: "delete",
        accountId,
      });
    },
    async createProject({
      $, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/projects",
        method: "post",
        data,
        accountId,
      });
    },
    async updateProject({
      $, projectId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}`,
        method: "patch",
        data,
        accountId,
      });
    },
    async deleteProject({
      $, projectId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}`,
        method: "delete",
        accountId,
      });
    },
    async listTaskAssignments({
      $, projectId, accountId, ...params
    }) {
      const path = projectId
        ? `/projects/${projectId}/task_assignments`
        : "/task_assignments";
      return this._makeRequest({
        $,
        path,
        params,
        accountId,
      });
    },
    async getTaskAssignment({
      $, projectId, taskAssignmentId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/task_assignments/${taskAssignmentId}`,
        accountId,
      });
    },
    async createTaskAssignment({
      $, projectId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/task_assignments`,
        method: "post",
        data,
        accountId,
      });
    },
    async updateTaskAssignment({
      $, projectId, taskAssignmentId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/task_assignments/${taskAssignmentId}`,
        method: "patch",
        data,
        accountId,
      });
    },
    async deleteTaskAssignment({
      $, projectId, taskAssignmentId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/task_assignments/${taskAssignmentId}`,
        method: "delete",
        accountId,
      });
    },
    async listUserAssignments({
      $, projectId, accountId, ...params
    }) {
      const path = projectId
        ? `/projects/${projectId}/user_assignments`
        : "/user_assignments";
      return this._makeRequest({
        $,
        path,
        params,
        accountId,
      });
    },
    async getUserAssignment({
      $, projectId, userAssignmentId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/user_assignments/${userAssignmentId}`,
        accountId,
      });
    },
    async createUserAssignment({
      $, projectId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/user_assignments`,
        method: "post",
        data,
        accountId,
      });
    },
    async updateUserAssignment({
      $, projectId, userAssignmentId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/user_assignments/${userAssignmentId}`,
        method: "patch",
        data,
        accountId,
      });
    },
    async deleteUserAssignment({
      $, projectId, userAssignmentId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/user_assignments/${userAssignmentId}`,
        method: "delete",
        accountId,
      });
    },
    async getTimeReport({
      $, reportBy, accountId, ...params
    }) {
      return this._makeRequest({
        $,
        path: `/reports/time/${reportBy}`,
        params,
        accountId,
      });
    },
    async getUser({
      $, userId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/users/${userId}`,
        accountId,
      });
    },
    async getMe({
      $, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/users/me",
        accountId,
      });
    },
    async createUser({
      $, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/users",
        method: "post",
        data,
        accountId,
      });
    },
    async updateUser({
      $, userId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/users/${userId}`,
        method: "patch",
        data,
        accountId,
      });
    },
    async deleteUser({
      $, userId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/users/${userId}`,
        method: "delete",
        accountId,
      });
    },
    async getInvoice({
      $, invoiceId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/invoices/${invoiceId}`,
        accountId,
      });
    },
    async createInvoice({
      $, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: "/invoices",
        method: "post",
        data,
        accountId,
      });
    },
    async updateInvoice({
      $, invoiceId, data, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/invoices/${invoiceId}`,
        method: "patch",
        data,
        accountId,
      });
    },
    async deleteInvoice({
      $, invoiceId, accountId,
    }) {
      return this._makeRequest({
        $,
        path: `/invoices/${invoiceId}`,
        method: "delete",
        accountId,
      });
    },
  },
};
