import { axios } from "@pipedream/platform";

const OPTION_PAGE_SIZE = 50;

export default {
  type: "app",
  app: "microsofttodo",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({
        prevContext, taskListId,
      }) {
        if (!taskListId) {
          return [];
        }
        const response = await this.getCollectionPage({
          nextLink: prevContext?.nextLink,
          path: `/me/todo/lists/${taskListId}/tasks`,
          params: {
            $top: OPTION_PAGE_SIZE,
          },
        });
        return {
          context: {
            nextLink: response["@odata.nextLink"],
          },
          options: response.value?.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })) || [],
        };
      },
    },
    taskListId: {
      type: "string",
      label: "Task List",
      description: "Identifier of a task list",
      async options({ prevContext }) {
        const response = await this.getCollectionPage({
          nextLink: prevContext?.nextLink,
          path: "/me/todo/lists",
          params: {
            $top: OPTION_PAGE_SIZE,
          },
        });
        return {
          context: {
            nextLink: response["@odata.nextLink"],
          },
          options: response.value?.map(({
            id: value, displayName: label,
          }) => ({
            value,
            label,
          })) || [],
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task.",
    },
    expectedTitle: {
      type: "string",
      label: "Expected Title",
      description: "The exact current `title` value returned by **List Tasks**, e.g. `Buy groceries`. This verifies that the task ID identifies the intended task; it is never used to find a task.",
    },
    expectedLastModifiedDateTime: {
      type: "string",
      label: "Expected Last Modified Date Time",
      description: "The exact `lastModifiedDateTime` value returned by **List Tasks**, e.g. `2026-10-20T14:32:10.1234567Z`. When provided, the action stops if the task changed after it was reviewed.",
      optional: true,
    },
    dueDateTime: {
      type: "string",
      label: "Due Date Time",
      description: "The date and time the task is due. The timestamp type represents date and time information using ISO 8601 format and is always in UTC time.",
      optional: true,
    },
    reminderDateTime: {
      type: "string",
      label: "Reminder Date",
      description: "The date for the reminder in ISO 8601 format",
      optional: true,
    },
    isReminderOn: {
      type: "boolean",
      label: "Turn Reminder On",
      description: "Whether to turn the reminder on",
      optional: true,
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "The importance of the task",
      options: [
        "low",
        "normal",
        "high",
      ],
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone for Due Date and/or Reminder Date",
      optional: true,
      async options() {
        const timeZonesResponse = await this.getSupportedTimeZones();
        return timeZonesResponse.value.map((tz) => ({
          label: tz.displayName,
          value: tz.alias,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      url,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    _validateNextLink(nextLink) {
      const baseUrl = new URL(this._baseUrl());
      const nextPageUrl = new URL(nextLink);
      if (nextPageUrl.origin !== baseUrl.origin || !nextPageUrl.pathname.startsWith(`${baseUrl.pathname}/`)) {
        throw new Error("Microsoft Graph returned an invalid pagination link.");
      }
      return nextPageUrl.toString();
    },
    /**
     * Retrieve one page of a Microsoft Graph collection for an async selector.
     *
     * @param {object} args - Request arguments.
     * @param {string} [args.nextLink] - Opaque next-page URL returned by Microsoft Graph.
     * @param {string} args.path - Initial Microsoft Graph API path.
     * @returns {Promise<object>} One collection response page.
     */
    getCollectionPage({
      nextLink, params, path, ...args
    }) {
      return this._makeRequest({
        ...args,
        ...(nextLink
          ? {
            url: this._validateNextLink(nextLink),
          }
          : {
            path,
            params,
          }),
      });
    },
    /**
     * Retrieve every page of a Microsoft Graph collection.
     *
     * @param {object} args - Request arguments.
     * @param {string} args.path - Initial Microsoft Graph API path.
     * @param {number} [args.maxItems] - Maximum total items to return.
     * @returns {Promise<object>} The first response envelope with all page values combined.
     */
    async _getAllPages({
      $ = this,
      maxItems,
      path,
      ...args
    }) {
      const values = [];
      const seenNextLinks = new Set();
      let response = await this._makeRequest({
        $,
        path,
        ...args,
      });
      const firstResponse = response;

      while (true) {
        if (!Array.isArray(response?.value)) {
          throw new Error(`Expected a collection response while retrieving ${path}.`);
        }

        values.push(...response.value);

        const nextLink = response["@odata.nextLink"];
        if (!nextLink || (maxItems != null && values.length >= maxItems)) {
          break;
        }

        if (seenNextLinks.has(nextLink)) {
          throw new Error(`Microsoft Graph returned a repeated pagination link while retrieving ${path}.`);
        }
        seenNextLinks.add(nextLink);

        response = await this._makeRequest({
          $,
          url: this._validateNextLink(nextLink),
        });
      }

      const result = {
        ...firstResponse,
        value: maxItems == null
          ? values
          : values.slice(0, maxItems),
      };
      delete result["@odata.nextLink"];
      return result;
    },
    async createHook(args = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...args,
      });
      return response;
    },
    async renewHook({
      hookId, ...args
    }) {
      return await this._makeRequest({
        method: "PATCH",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async deleteHook({
      hookId, ...args
    }) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async getSupportedTimeZones() {
      return this._makeRequest({
        method: "GET",
        path: "/me/outlook/supportedTimeZones",
      });
    },
    getTask({
      taskListId, taskId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks/${taskId}`,
        ...args,
      });
    },
    listTasks({
      taskListId, ...args
    }) {
      return this._getAllPages({
        path: `/me/todo/lists/${taskListId}/tasks`,
        ...args,
      });
    },
    listLists(args = {}) {
      return this._getAllPages({
        path: "/me/todo/lists",
        ...args,
      });
    },
    createTask({
      taskListId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks`,
        method: "POST",
        ...args,
      });
    },
    createList(args = {}) {
      return this._makeRequest({
        path: "/me/todo/lists",
        method: "POST",
        ...args,
      });
    },
    updateTask({
      taskId, taskListId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks/${taskId}`,
        method: "PATCH",
        ...args,
      });
    },
    deleteTask({
      taskId, taskListId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks/${taskId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
