import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "exhibitday",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event",
      optional: true,
      async options() {
        const { list_data: events } = await this.listEvents();
        return events?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({ eventId }) {
        const params = eventId
          ? {
            filter_by_event_id: eventId,
          }
          : {};
        const { list_data: tasks } = await this.listTasks({
          params,
        });
        return tasks?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskSectionId: {
      type: "string",
      label: "Task Section",
      description: "The id of the event task section that the task should be placed under. Leave this value blank if you don't want to place/categorize the task under a specific event task section.",
      optional: true,
      async options({ eventId }) {
        if (!eventId) {
          throw new ConfigurationError("Enter `eventId` to list task sections.");
        }
        const { task_sections: sections } = await this.getEvent({
          params: {
            id: eventId,
          },
        });
        return sections?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The user assignee of the task",
      optional: true,
      async options() {
        const { list_data: users } = await this.listUsers();
        const assignees = users?.filter(
          ({ can_have_tasks_assigned }) => can_have_tasks_assigned,
        ) || [];
        return assignees?.map(({
          id: value, display_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    eventFormat: {
      type: "integer",
      label: "Event Format",
      description: "The format for the event",
      options: constants.EVENT_FORMATS,
      optional: true,
    },
    participationType: {
      type: "integer",
      label: "Participation Type",
      description: "Participation type of the event",
      options: constants.PARTICIPATION_TYPES,
      optional: true,
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    isCompleted: {
      type: "boolean",
      label: "Is Completed",
      description: "Boolean representing whether or not the task has been completed.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Task due date (format: YYYY-MM-DD).",
      optional: true,
    },
    details: {
      type: "string",
      label: "Details",
      description: "The details/description of the task. Only accepts plain text. Any html tags in the value you pass in will be stripped. New line characters will get replaced with a <br/> tag.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.exhibitday.com/v1";
    },
    _headers(headers) {
      return {
        ...headers,
        "api_key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(headers),
      });
    },
    getEvent(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/events/info",
      });
    },
    createEvent(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/events",
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/tasks",
      });
    },
    updateTask(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "PATCH",
        path: "/tasks",
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/events",
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/tasks",
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/references/users_and_resources",
      });
    },
  },
};
