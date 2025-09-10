import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "box",
  propDefinitions: {
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A comma-separated list of attributes to include in the response. This can be used to request fields that are not normally returned in a standard response, e.g. `id,type,name`",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Defines the time the file was originally created at. If not set, file's original upload time will be used. Must be in RFC3339 format without milliseconds, e.g. `2022-07-20T10:53:43-08:00`",
      optional: true,
    },
    modifiedAt: {
      type: "string",
      label: "Modified At",
      description: "Defines the time the file was last modified at. If not set, file's original modified time will be used. Must be in RFC3339 format without milliseconds, e.g. `2022-07-20T10:53:43-08:00`",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file. If not set, file's original name will be used.",
      optional: true,
    },
    searchType: {
      type: "string",
      label: "Type",
      description: "Limits the search results to any items of this type. By default the API returns items that match any of these types.",
      optional: true,
      options: constants.searchTypes,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The string to search for. This query is matched against item names, descriptions, text content of files, and various other fields of the different item types. [Please see the docs](https://developer.box.com/reference/get-search/#param-query)",
      optional: true,
    },
    mdfilters: {
      type: "string",
      label: "Metadata Filters",
      description: "A list of metadata templates to filter the search results by. e.g. `[{\"scope\":\"enterprise\",\"templateKey\":\"contract\",\"filters\":{\"category\":\"online\"}}]`. [Please see the docs](https://developer.box.com/reference/resources/metadata-filter/)",
      optional: true,
    },
    parentId: {
      type: "string",
      label: "Parent",
      description: "The parent folder to upload the file to. If not set, `0` will be used as root folder.",
      optional: true,
      default: "0",
      async options({ prevContext }) {
        const {
          marker,
          queue,
        } = prevContext;
        if (!queue || !queue.length || marker) {
          const initQueue = queue ?? [];
          const resp = await this.getItems({
            folderId: 0,
            params: {
              limit: constants.pageSize,
              marker,
              usemarker: true,
            },
          });
          return {
            context: {
              marker: resp.entries?.length ? //Box API sends new markers even if entries are empty
                resp.next_marker :
                undefined,
              queue: [
                ...initQueue,
                ...resp.entries.filter((e) => e.type == "folder").map((e) => e.id),
              ],
            },
            options: resp.entries.filter((e) => e.type == "folder").map((e) => ({
              value: e.id,
              label: e.name,
            })),
          };
        } else {
          const reverseQueue = queue.reverse();
          while (reverseQueue.length) {
            const folderId = reverseQueue.pop();
            const innerResp = await this.getItems({
              folderId,
              params: {
                limit: constants.pageSize,
                marker,
                usemarker: true,
              },
            });
            if (!innerResp.entries.filter((e) => e.type == "folder").length) {
              continue;
            }
            return {
              context: {
                marker: innerResp.next_marker,
                queue: [
                  ...reverseQueue.reverse(),
                  ...innerResp.entries.filter((e) => e.type == "folder").map((e) => e.id),
                ],
              },
              options: innerResp.entries.filter((e) => e.type == "folder").map((e) => ({
                value: e.id,
                label: e.name,
              })),
            };
          }
          return {
            context: { },
            options: [],
          };
        }
      },
    },
    webhookTarget: {
      type: "string",
      label: "Target",
      description: "The target item that will be used by webhooks.",
      async options({
        prevContext, type,
      }) {
        const {
          marker,
          queue,
        } = prevContext;
        if (!queue || !queue.length || marker) {
          const initQueue = queue ?? [];
          const resp = await this.getItems({
            folderId: 0,
            params: {
              limit: constants.pageSize,
              marker,
              usemarker: true,
            },
          });
          return {
            context: {
              marker: resp.entries?.length ?
                resp.next_marker :
                undefined,
              queue: [
                ...initQueue,
                ...resp.entries.filter((e) => e.type == "folder").map((e) => e.id),
              ],
            },
            options: resp.entries.filter((e) => !type || e.type == type).map((e) => ({
              value: JSON.stringify({
                id: e.id,
                type: e.type,
              }),
              label: e.name,
            })),
          };
        } else {
          const reverseQueue = queue.reverse();
          while (reverseQueue.length) {
            const folderId = reverseQueue.pop();
            const innerResp = await this.getItems({
              folderId,
              params: {
                limit: constants.pageSize,
                marker,
                usemarker: true,
              },
            });
            if (!innerResp.entries.length) {
              continue;
            }
            return {
              context: {
                marker: innerResp.next_marker,
                queue: [
                  ...reverseQueue.reverse(),
                  ...innerResp.entries.filter((e) => e.type == "folder").map((e) => e.id),
                ],
              },
              options: innerResp.entries.filter((e) => !type || e.type == type).map((e) => ({
                value: JSON.stringify({
                  id: e.id,
                  type: e.type,
                }),
                label: e.name,
              })),
            };
          }
          return {
            context: { },
            options: [],
          };
        }
      },
    },
    fileId: {
      type: "string",
      label: "File",
      description: "The file to download",
      async options({
        folderId, page,
      }) {
        const limit = constants.pageSize;
        const { entries } = await this.getItems({
          folderId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return entries.filter(({ type }) => type === "file").map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _getApiUrl(path) {
      return `https://api.box.com/2.0${path}`;
    },
    _getUploadUrl(path) {
      return `https://upload.box.com/api/2.0${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getApiUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    async deleteHook({
      hookId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...args,
      });
    },
    async getItems({
      folderId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/folders/${folderId}/items`,
        ...args,
      });
    },
    async uploadFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: this._getUploadUrl("/files/content"),
        ...args,
      });
    },
    async uploadFileVersion({
      fileId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: this._getUploadUrl(`/files/${fileId}/content`),
        ...args,
      });
    },
    async downloadFile({
      fileId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/files/${fileId}/content`,
        responseType: "stream",
        ...args,
      });
    },
    async searchContent(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/search",
        ...args,
      });
    },
    async getComments({
      fileId, ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/files/${fileId}/comments`,
        ...args,
      });
    },
    async createSignRequest(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sign_requests",
        ...args,
      });
    },
  },
};
