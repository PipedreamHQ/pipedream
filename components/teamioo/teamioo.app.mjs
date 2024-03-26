import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamioo",
  propDefinitions: {
    groupid: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to bookmark",
    },
    bookmarkType: {
      type: "string",
      label: "Bookmark Type",
      description: "The type of the bookmark, either 'personal' or 'group'",
      options: [
        "personal",
        "group",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "An optional title for the bookmark",
      optional: true,
    },
    eventTitle: {
      type: "string",
      label: "Event Title",
      description: "The title of the event",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the event",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of the event, can be 'personal', 'office', or 'group'",
      options: [
        "personal",
        "office",
        "group",
      ],
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the event",
      optional: true,
    },
    taskTitle: {
      type: "string",
      label: "Task Title",
      description: "The title of the task",
    },
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of the task, either 'personal' or 'group'",
      options: [
        "personal",
        "group",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Whom the task is assigned to",
      optional: true,
    },
    priorityLevel: {
      type: "string",
      label: "Priority Level",
      description: "The urgency of the task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://demo.teamioo.com/teamiooapi";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async saveBookmark({
      url, bookmarkType, title,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/bookmarks/save",
        data: {
          url,
          bookmark_type: bookmarkType,
          title,
        },
      });
    },
    async createEvent({
      eventTitle, startTime, endTime, eventType, location,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events/create",
        data: {
          event_title: eventTitle,
          start_time: startTime,
          end_time: endTime,
          event_type: eventType,
          location,
        },
      });
    },
    async createTask({
      taskTitle, taskType, dueDate, assignedTo, priorityLevel,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks/create",
        data: {
          task_title: taskTitle,
          task_type: taskType,
          due_date: dueDate,
          assigned_to: assignedTo,
          priority_level: priorityLevel,
        },
      });
    },
  },
};
