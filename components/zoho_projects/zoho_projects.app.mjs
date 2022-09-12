import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "zoho_projects",
  propDefinitions: {
    portalId: {
      type: "string",
      label: "Portal ID",
      description: "The ID of the portal",
      async options() {
        const { portals } = await this.getPortals();
        return portals.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({
        portalId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        if (index === null) {
          return [];
        }
        const { projects = [] } =
          await this.getProjects({
            portalId,
            params: {
              index,
              range: constants.MAX_RANGE,
            },
          });
        const currentLen = projects.length;
        const options = projects.map(({
          id_string: value,
          name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            index: currentLen
              ? currentLen + index
              : null,
          },
        };
      },
    },
    projectUserId: {
      type: "string",
      label: "Project User ID",
      description: "User ID of the project.",
      async options({
        portalId, projectId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        if (index === null) {
          return [];
        }
        const { users = [] } =
          await this.getProjectUsers({
            portalId,
            projectId,
            params: {
              index,
              range: constants.MAX_RANGE,
            },
          });
        const currentLen = users.length;
        const options = users.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            index: currentLen
              ? currentLen + index
              : null,
          },
        };
      },
    },
    folderId: {
      type: "string",
      label: "Third Party Folder ID",
      description: "Third party folder ID of the project.",
      async options({
        portalId, projectId, prevContext,
      }) {
        const { index = 1 } = prevContext;
        if (index === null) {
          return [];
        }
        const { folders } =
          await this.getAssociatedTeamFolders({
            portalId,
            projectId,
            params: {
              index,
              range: constants.MAX_RANGE,
            },
          });
        const currentLen = folders.length;
        const options = folders.map(({
          thirdparty_folder_id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            index: currentLen
              ? currentLen + index
              : null,
          },
        };
      },
    },
  },
  methods: {
    getUrl(url, path, versionPath) {
      const { region } = this.$auth;
      return url || `${constants.BASE_PREFIX_URL}${region}${versionPath}${path}`;
    },
    getHeaders(headers) {
      const { oauth_access_token: oauthAccessToken } = this.$auth;
      const authorization = `${constants.TOKEN_PREFIX} ${oauthAccessToken}`;
      return {
        Authorization: authorization,
        ...constants.DEFAULT_HEADERS,
        ...headers,
      };
    },
    getParams(url, params) {
      if (!url) {
        return params;
      }
    },
    async makeRequest({
      $ = this,
      url,
      path,
      headers: preHeaders,
      params,
      data: preData,
      versionPath = constants.VERSION_PATH,
      withRetries = true,
      ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;

      const hasMultipartHeader = utils.hasMultipartHeader(preHeaders);
      const data = hasMultipartHeader && utils.getFormData(preData) || preData;

      const currentHeaders = this.getHeaders(preHeaders);
      const headers = hasMultipartHeader
        ? {
          ...currentHeaders,
          [contentType]: data.getHeaders()[contentType.toLowerCase()],
        }
        : currentHeaders;

      const config = {
        headers,
        url: this.getUrl(url, path, versionPath),
        params: this.getParams(url, params),
        data,
        ...args,
      };
      try {
        return withRetries
          ? await utils.withRetries(() => axios($, config))
          : await axios($, config);
      } catch (error) {
        console.log("Request error", error.response?.data);
        throw error.response?.data;
      }
    },
    async addTimeGeneralLog({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/logs/`,
        method: "post",
        ...args,
      });
    },
    async createBug({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/bugs/`,
        method: "post",
        ...args,
      });
    },
    async createMilestone({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/milestones/`,
        method: "post",
        ...args,
      });
    },
    async createProject({
      portalId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/`,
        method: "post",
        ...args,
      });
    },
    async createTask({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/tasks/`,
        method: "post",
        ...args,
      });
    },
    async createTaskList({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/tasklists/`,
        method: "post",
        ...args,
      });
    },
    async searchProject({
      portalId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/search`,
        ...args,
      });
    },
    async updateProject({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/`,
        method: "post",
        ...args,
      });
    },
    async getPortals(args = {}) {
      return this.makeRequest({
        path: "/portals/",
        ...args,
      });
    },
    async getProjects({
      portalId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/`,
        ...args,
      });
    },
    async getBugs({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/bugs/`,
        ...args,
      });
    },
    async getAssociatedTeamFolders({
      portalId, projectId, ...args
    }) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/folders`,
        versionPath: constants.VERSION3_PATH,
        ...args,
      });
    },
    async uploadFiles({
      portalId, folderId, ...args
    }) {
      return this.makeRequest({
        path: `/portal/${portalId}/documents/thirdparty/files/${folderId}`,
        versionPath: constants.VERSION3_PATH,
        method: "post",
        ...args,
      });
    },
    async getLogs({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/logs/`,
        ...args,
      });
    },
    async getMilestones({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/milestones/`,
        ...args,
      });
    },
    async getTasks({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/tasks/`,
        ...args,
      });
    },
    async getTaskLists({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/tasklists/`,
        ...args,
      });
    },
    async getProjectUsers({
      portalId, projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/portal/${portalId}/projects/${projectId}/users/`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceName,
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let index = 1;
      let resourcesCount = 0;
      let nextResources;

      while (true) {
        try {
          const response =
            await resourceFn({
              withRetries: false,
              ...resourceFnArgs,
              params: {
                ...resourceFnArgs.params,
                index,
              },
            });
          ({ [resourceName]: nextResources } =
            response || {
              [resourceName]: [],
            });
        } catch (error) {
          console.log("Stream error", error);
          return;
        }

        if (nextResources?.length < 1) {
          return;
        }

        index += nextResources?.length;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (max && resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
