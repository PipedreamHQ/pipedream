import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sourceforge",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description: "The name of a project",
      async options() {
        const projects = await this.listProjects();
        return projects?.map(({ name }) => name ) || [];
      },
    },
    ticket: {
      type: "string",
      label: "Ticket",
      description: "The ticket number of a ticket",
      async options({ project }) {
        const { tickets } = await this.listTickets({
          project,
        });
        return tickets?.map(({
          ticket_num: num, summary,
        }) => ({
          label: summary,
          value: num,
        })) || [];
      },
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "The ticket title",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The ticket description",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Array of labels assigned to the ticket",
      optional: true,
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "Username of the ticket assignee",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://sourceforge.net/rest";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.bearer_token}`,
      };
    },
    _username() {
      return this.$auth.username;
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook({
      project, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}/admin/code/webhooks/repo-push`,
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      project, hookId, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}/admin/code/webhooks/repo-push/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    getProject({
      project, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}`,
        ...args,
      });
    },
    getTicket({
      project, ticket, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}/tickets/${ticket}`,
        ...args,
      });
    },
    async listProjects(args = {}) {
      const { projects = [] } = await this._makeRequest({
        path: `/u/${this._username()}/profile`,
        ...args,
      });
      return projects;
    },
    listTickets({
      project, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}/tickets`,
        ...args,
      });
    },
    createTicket({
      project, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}/tickets/new`,
        method: "POST",
        ...args,
      });
    },
    updateTicket({
      project, ticket, ...args
    }) {
      return this._makeRequest({
        path: `/p/${project}/tickets/${ticket}/save`,
        method: "POST",
        ...args,
      });
    },
  },
};
