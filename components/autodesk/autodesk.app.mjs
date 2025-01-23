import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autodesk",
  propDefinitions: {
    hubId: {
      type: "string",
      label: "Hub ID",
      description: "The identifier of a hub",
      async options() {
        const { data } = await this.listHubs();
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name,
          value: id,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The identifier of a project",
      async options({
        hubId, page,
      }) {
        if (!hubId) {
          return [];
        }
        const { data } = await this.listProjects({
          hubId,
          params: {
            "page[number]": page,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name,
          value: id,
        })) || [];
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The identifier of a folder",
      async options({
        hubId, projectId,
      }) {
        if (!hubId || !projectId) {
          return [];
        }
        const rootFolderId = await this.getProjectTopFolderId({
          hubId,
          projectId,
        });
        const options = [
          {
            label: "Root Folder",
            value: rootFolderId,
          },
        ];

        const fetchFoldersRecursively = async (folderId, depth = 0, maxDepth = 10) => {
          if (depth > maxDepth) {
            return;
          }
          const { data } = await this.getFolderContent({
            projectId,
            folderId,
            params: {
              "filter[type]": "folders",
            },
          });
          const folders = data?.map(({
            id, attributes,
          }) => ({
            label: attributes.name,
            value: id,
          })) || [];

          options.push(...folders);

          for (const folder of folders) {
            await fetchFoldersRecursively(folder.value, depth + 1, maxDepth);
          }
        };

        await fetchFoldersRecursively(rootFolderId);

        return options;
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://developer.api.autodesk.com";
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
          ...headers,
        },
        ...otherOpts,
      });
    },
    createWebhook({
      system, event, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/webhooks/v1/systems/${system}/events/${event}/hooks`,
        ...opts,
      });
    },
    deleteWebhook({
      system, event, hookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/v1/systems/${system}/events/${event}/hooks/${hookId}`,
      });
    },
    listHubs(opts = {}) {
      return this._makeRequest({
        path: "/project/v1/hubs",
        ...opts,
      });
    },
    listProjects({
      hubId, ...opts
    }) {
      return this._makeRequest({
        path: `/project/v1/hubs/${hubId}/projects`,
        ...opts,
      });
    },
    async getProjectTopFolderId({
      hubId, projectId, ...opts
    }) {
      const { data } = await this._makeRequest({
        path: `/project/v1/hubs/${hubId}/projects/${projectId}/topFolders`,
        ...opts,
      });
      return data[0].id;
    },
    getFolderContent({
      projectId, folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/data/v1/projects/${projectId}/folders/${folderId}/contents`,
        ...opts,
      });
    },
    createFolder({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/data/v1/projects/${projectId}/folders`,
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
        ...opts,
      });
    },
    createStorageLocation({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/data/v1/projects/${projectId}/storage`,
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
        ...opts,
      });
    },
    generateSignedUrl({
      bucketKey, objectKey, ...opts
    }) {
      return this._makeRequest({
        path: `/oss/v2/buckets/${bucketKey}/objects/${objectKey}/signeds3upload`,
        ...opts,
      });
    },
    completeUpload({
      bucketKey, objectKey, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/oss/v2/buckets/${bucketKey}/objects/${objectKey}/signeds3upload`,
        ...opts,
      });
    },
    createFirstVersionOfFile({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/data/v1/projects/${projectId}/items`,
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
        ...opts,
      });
    },
    async *paginate({
      fn,
      args,
      max,
    }) {
      let hasMore = true;
      let count = 0;
      args = {
        ...args,
        params: {
          ...args?.params,
          "page[number]": 0,
          "page[limit]": 200,
        },
      };
      while (hasMore) {
        const { data } = await fn(args);
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = data?.length === args.params["page[limit]"];
        args.params["page[number]"] += 1;
      }
    },
  },
};
