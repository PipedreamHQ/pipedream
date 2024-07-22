import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "v7_go",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
    },
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "The ID of the entity",
    },
    fieldName: {
      type: "string",
      label: "Field Name",
      description: "The name of the field within the entity",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project or entity",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional fields to include when creating an entity",
      optional: true,
    },
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "The type of the entity",
    },
    entityIdentifier: {
      type: "string",
      label: "Entity Identifier",
      description: "The identifier of the entity",
    },
    newAttributes: {
      type: "object",
      label: "New Attributes",
      description: "New attributes or relations for the entity",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://go.v7labs.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createProject({
      workspaceId, name,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/projects`,
        data: {
          name,
        },
      });
    },
    async createEntity({
      workspaceId, projectId, fields,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities`,
        data: {
          fields,
        },
      });
    },
    async updateEntity({
      workspaceId, projectId, entityId, newAttributes,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities/${entityId}`,
        data: {
          fields: newAttributes,
        },
      });
    },
    async emitNewEntityEvent({
      workspaceId, projectId,
    }) {
      // Logic to emit new entity event
    },
    async emitEntityCompletionEvent({
      workspaceId, projectId,
    }) {
      // Logic to emit entity completion event
    },
    async emitFieldCompletionEvent({
      entityId, fieldName,
    }) {
      // Logic to emit field completion event
    },
    async listEntities({
      workspaceId, projectId,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities`,
      });
    },
    async getEntity({
      workspaceId, projectId, entityId,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities/${entityId}`,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response = await fn(...opts);
      results = results.concat(response.data);

      while (response.has_next_page) {
        response = await fn({
          ...opts,
          offset: response.current_offset + 1,
        });
        results = results.concat(response.data);
      }

      return results;
    },
  },
};
