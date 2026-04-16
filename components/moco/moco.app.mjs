import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "moco",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ page }) {
        const projects = await this.listProjects({
          params: {
            page: page + 1,
          },
        });
        return projects.map((project) => ({
          label: `${project.name} (${project.identifier})`,
          value: project.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({
        page, projectId,
      }) {
        const tasks = await this.listProjectTasks({
          projectId,
          params: {
            page: page + 1,
          },
        });
        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice to create a payment for",
      async options({ page }) {
        const invoices = await this.listInvoices({
          params: {
            page: page + 1,
            status: "created,sent,partially_paid,paid,overdue",
          },
        });
        return invoices.map((invoice) => ({
          label: `${invoice.identifier || invoice.id} - ${invoice.title || invoice.user?.firstname || ""} ${invoice.user?.lastname || ""}`,
          value: invoice.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.mocoapp.com/api/v1`;
    },
    _headers() {
      return {
        "Authorization": `Token token=${this.$auth.api_key}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listProjectTasks({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    getTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks/${taskId}`,
        ...opts,
      });
    },
    createInvoicePayment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices/payments",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/account/web_hooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/account/web_hooks/${webhookId}`,
      });
    },
  },
};
