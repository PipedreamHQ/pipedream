import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "copper",
  propDefinitions: {
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The ID of the CRM object",
      async options({
        objectType, page,
      }) {
        const objects = await this.listObjects({
          objectType,
          params: {
            page_number: page + 1,
          },
        });
        return objects?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of the tags associated with the Project",
      optional: true,
      async options() {
        const tags = await this.listTags();
        return tags?.map(({ name }) => name) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the Project",
      optional: true,
      options: [
        "Open",
        "Completed",
      ],
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of CRM object",
      async options() {
        return [
          {
            label: "Lead",
            value: "leads",
          },
          {
            label: "Person",
            value: "people",
          },
          {
            label: "Company",
            value: "companies",
          },
          {
            label: "Opportunity",
            value: "opportunities",
          },
          {
            label: "Project",
            value: "projects",
          },
          {
            label: "Task",
            value: "tasks",
          },
        ];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.copper.com/developer_api/v1";
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
          "X-PW-AccessToken": this.$auth.api_key,
          "X-PW-Application": "developer_api",
          "X-PW-UserEmail": this.$auth.email,
          "Content-Type": "application/json",
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    listObjects({
      objectType, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${objectType}/search`,
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    getObject({
      objectType, objectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${objectType}/${objectId}`,
        ...opts,
      });
    },
    createPerson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people",
        ...opts,
      });
    },
    updatePerson({
      personId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/people/${personId}`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
    updateProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}`,
        ...opts,
      });
    },
    relateProjectToCrmObject({
      objectType, objectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${objectType}/${objectId}/related`,
        ...opts,
      });
    },
  },
};
