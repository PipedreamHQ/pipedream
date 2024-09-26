import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timing",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description: "The project reference of the project. Example: `/projects/1`",
      async options() {
        const { data } = await this.listProjects();
        return data?.map(({
          self: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The time entry's start date and time. Example: `2019-01-01T00:00:00+00:00`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The time entry's end date and time. Example: `2019-01-01T01:00:00+00:00`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The time entry's title",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The time entry's notes",
      optional: true,
    },
    replaceExisting: {
      type: "boolean",
      label: "Replace Existing",
      description: "If `true`, any existing time entries that overlap with the new time entry will be adjusted to avoid overlap, or deleted altogether. Defaults to `false`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://web.timingapp.com/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
        },
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listTimeEntries(opts = {}) {
      return this._makeRequest({
        path: "/time-entries",
        ...opts,
      });
    },
    startNewTimer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/time-entries/start",
        ...opts,
      });
    },
    stopActiveTimer(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/time-entries/stop",
        ...opts,
      });
    },
    createNewTimeEntry(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/time-entries",
        ...opts,
      });
    },
  },
};
