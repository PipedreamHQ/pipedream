// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clockify",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "Identifier of a workspace",
      async options() {
        const workspaces = await this.listWorkspaces();
        return workspaces?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options({
        workspaceId, page,
      }) {
        const projects = await this.listProjects({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return projects?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    clientId: {
      type: "string",
      label: "Client",
      description: "Identifier of a client",
      optional: true,
      async options({
        workspaceId, page,
      }) {
        const clients = await this.listClients({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return clients?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    memberIds: {
      type: "string[]",
      label: "Members",
      description: "Array of member/user identifiers",
      async options({
        workspaceId, page,
      }) {
        const members = await this.listMembers({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return members?.map(({
          id: value, name, email,
        }) => ({
          value,
          label: name || email,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({
        workspaceId, projectId, page,
      }) {
        if (!workspaceId || !projectId) {
          return [];
        }
        const tasks = await this.listTasks({
          workspaceId,
          projectId,
          params: {
            page: page + 1,
          },
        });
        return tasks?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "Array of tag identifiers",
      async options({
        workspaceId, page,
      }) {
        const tags = await this.listTags({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return tags?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    hydrated: {
      type: "boolean",
      label: "Hydrated",
      description: "If set to `true`, you'll get a hydrated response with additional information",
      optional: true,
    },
    strictNameSearch: {
      type: "boolean",
      label: "Strict Name Search",
      description: "Flag to toggle on/off strict search mode",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The order to sort the results by",
      optional: true,
      options: [
        "ASCENDING",
        "DESCENDING",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return. Default is `1`",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of results to return. Default is `100`",
      optional: true,
      default: 100,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date and time of the time entry, in ISO 8601 format. Example: `2024-01-01T09:00:00Z`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "End date and time of the time entry, in ISO 8601 format. Example: `2024-01-01T17:00:00Z`",
      optional: true,
    },
    timeEntryDescription: {
      type: "string",
      label: "Description",
      description: "Description of the time entry",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Whether the time entry is billable",
      optional: true,
    },
    timeEntryType: {
      type: "string",
      label: "Type",
      description: "The type of the time entry",
      optional: true,
      options: [
        "REGULAR",
        "BREAK",
      ],
    },
    timeEntryId: {
      type: "string",
      label: "Time Entry ID",
      description: "Identifier of a time entry. Use the **List Time Entries** action to find the ID of the entry you want to update.",
    },
    tagId: {
      type: "string",
      label: "Tag",
      description: "Identifier of a tag. Use the **List Tags** action to find the ID of the tag you want to update or delete.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Identifier of an invoice. Use the **List Invoices** action to find the ID of the invoice you want to update or delete.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.clockify.me/api/v1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _headers() {
      return {
        "X-Api-Key": `${this._apiKey()}`,
      };
    },
    _makeRequest({
      $ = this,
      url,
      path,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    listProjects({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects`,
        ...args,
      });
    },
    listClients({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/clients`,
        ...args,
      });
    },
    listMembers({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/users`,
        ...args,
      });
    },
    listTasks({
      workspaceId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        ...args,
      });
    },
    listTimeEntries({
      workspaceId, userId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/user/${userId}/time-entries`,
        ...args,
      });
    },
    listTags({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/tags`,
        ...args,
      });
    },
    getTimeEntryReport({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `https://reports.api.clockify.me/v1/workspaces/${workspaceId}/reports/detailed`,
        ...args,
      });
    },
    createProject({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects`,
        method: "POST",
        ...args,
      });
    },
    updateMemberships({
      workspaceId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}/memberships`,
        method: "PATCH",
        ...args,
      });
    },
    createTask({
      workspaceId, projectId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
        method: "POST",
        ...args,
      });
    },
    createTimeEntry({
      workspaceId, userId, ...args
    }) {
      return this._makeRequest({
        path: userId
          ? `/workspaces/${workspaceId}/user/${userId}/time-entries`
          : `/workspaces/${workspaceId}/time-entries`,
        method: "POST",
        ...args,
      });
    },
    updateTimeEntry({
      workspaceId, timeEntryId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/time-entries/${timeEntryId}`,
        method: "PUT",
        ...args,
      });
    },
    stopTimeEntry({
      workspaceId, userId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/user/${userId}/time-entries`,
        method: "PATCH",
        ...args,
      });
    },
    createClient({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/clients`,
        method: "POST",
        ...args,
      });
    },
    updateClient({
      workspaceId, clientId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/clients/${clientId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteClient({
      workspaceId, clientId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/clients/${clientId}`,
        method: "DELETE",
        ...args,
      });
    },
    createTag({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/tags`,
        method: "POST",
        ...args,
      });
    },
    updateTag({
      workspaceId, tagId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/tags/${tagId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteTag({
      workspaceId, tagId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/tags/${tagId}`,
        method: "DELETE",
        ...args,
      });
    },
    createInvoice({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/invoices`,
        method: "POST",
        ...args,
      });
    },
    updateInvoice({
      workspaceId, invoiceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/invoices/${invoiceId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteInvoice({
      workspaceId, invoiceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/invoices/${invoiceId}`,
        method: "DELETE",
        ...args,
      });
    },
    listInvoices({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/invoices`,
        ...args,
      });
    },
  },
};
