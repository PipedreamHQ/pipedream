import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "v7_go",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace",
      async options() {
        const { data } = await this.listWorkspaces();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({
        page, workspaceId,
      }) {
        const { data } = await this.listProjects({
          workspaceId,
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return data.map(({
          id: value, name,
        }) => ({
          label: name || value,
          value,
        }));
      },
    },
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "The ID of the entity",
      async options({
        page, workspaceId, projectId,
      }) {
        const { data } = await this.listEntities({
          workspaceId,
          projectId,
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return data.map(({ id }) => id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://go.v7labs.com/api";
    },
    _headers() {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createProject({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/projects`,
        ...opts,
      });
    },
    createEntity({
      workspaceId, projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities`,
        ...opts,
      });
    },
    getEntity({
      workspaceId, projectId, entityId,
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities/${entityId}`,
      });
    },
    getProject({
      workspaceId, projectId,
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/projects/${projectId}`,
      });
    },
    updateEntity({
      workspaceId, projectId, entityId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities/${entityId}`,
        ...opts,
      });
    },
    listEntities({
      workspaceId, projectId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/workspaces/${workspaceId}/projects/${projectId}/entities`,
        ...opts,
      });
    },
    listProjects({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/workspaces/${workspaceId}/projects`,
        ...opts,
      });
    },
    listWorkspaces() {
      return this._makeRequest({
        method: "GET",
        path: "/workspaces",
      });
    },
    parseObject(object) {
      const arrayKeys = Object.keys(object);
      return arrayKeys.reduce((prev, curr) => {
        let value = object[curr];
        const prefix = curr.split("_");

        switch (prefix[0]) {
        case "SINGLE" : value = {
          options: [
            value,
          ],
        }; break;
        case "MULTI" : value = {
          options: value,
        }; break;
        case "URL" : value = {
          url: value,
        }; break;
        case "FILE" : value = {
          file_url: value,
        }; break;
        }

        return {
          ...prev,
          [prefix[1]]: value,
        };
      }, {});
    },
    async prepareProps({
      projectId, workspaceId, entityId,
    }) {
      const props = {};
      let fields;
      const { properties } = await this.getProject({
        workspaceId,
        projectId,
      });

      if (entityId) {
        const entityProps = await this.getEntity({
          workspaceId,
          projectId,
          entityId,
        });
        fields = entityProps.fields;
      }

      for (const prop of properties) {
        if (prop.type === "collection") continue;

        const type = prop.type === "multi_select"
          ? "string[]"
          : "string";

        let responseType = "STRING";

        switch (prop.type) {
        case "single_select": responseType = "SINGLE"; break;
        case "multi_select": responseType = "MULTI"; break;
        case "url": responseType = "URL"; break;
        case "file": responseType = "FILE"; break;
        }

        props[`${responseType}_${prop.id}`] = {
          type,
          label: prop.name,
          optional: true,
        };

        if (entityId) {
          if (fields[prop.slug].manual_value?.value) {
            const value = fields[prop.slug].manual_value.value;
            const parsedValue = prop.type === "single_select"
              ? value.join()
              : value;
            props[`${responseType}_${prop.id}`].default = parsedValue;
          }
        }

        if (prop.config?.options) {
          props[`${responseType}_${prop.id}`].options = prop.config.options.map(({ value }) => value);
        }
      }
      return props;
    },
    createWebhook({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/triggers`,
        ...opts,
      });
    },
    deleteWebhook({
      workspaceId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/workspaces/${workspaceId}/triggers/${webhookId}`,
      });
    },
  },
};
