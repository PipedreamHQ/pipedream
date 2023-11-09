import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "productive_io",
  propDefinitions: {
    // Required prop for creating a booking
    bookingDetails: {
      type: "object",
      label: "Booking Details",
      description: "The details of the booking to create",
    },
    // Required prop for creating a contact
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the contact to create",
    },
    // Required prop for creating a task
    taskDetails: {
      type: "object",
      label: "Task Details",
      description: "The details of the task to create",
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Select the project to associate with this task",
      async options({ prevContext }) {
        const { page = 1 } = prevContext;
        const projects = await this.listProjects({
          params: {
            "page[number]": page,
            "page[size]": 20,
          },
        });
        return {
          options: projects.map((project) => ({
            label: project.attributes.name,
            value: project.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    taskListId: {
      type: "string",
      label: "Task List",
      description: "Select the task list to associate with this task",
      async options({
        projectId, prevContext,
      }) {
        const { page = 1 } = prevContext;
        const taskLists = await this.listTaskLists({
          params: {
            "filter[project_id]": projectId,
            "page[number]": page,
            "page[size]": 20,
          },
        });
        return {
          options: taskLists.map((taskList) => ({
            label: taskList.attributes.name,
            value: taskList.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    // Additional props for optional parameters should be added here
  },
  methods: {
    _baseUrl() {
      return "https://api.productive.io/api/v2";
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
          "X-Auth-Token": this.$auth.api_token,
          "X-Organization-Id": this.$auth.organization_id,
          "Content-Type": "application/vnd.api+json",
        },
      });
    },
    async listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    async listTaskLists(opts = {}) {
      return this._makeRequest({
        path: "/task_lists",
        ...opts,
      });
    },
    // Additional methods for creating bookings, contacts, and tasks should be added here
    async createBooking(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/bookings",
        ...opts,
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    async createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    // Methods for emitting events for new deals, invoices, and bookings should be added here
  },
};
