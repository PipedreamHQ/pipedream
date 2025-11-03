import axios from "axios";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_workdrive",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The unique ID that represents a team.",
      async options() {
        const { data: { id: userId } } = await this.getUser();
        const { data } = await this.listTeams({
          userId,
        });

        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "The unique ID of the folder where files are to be uploaded. Select a folder to view its subfolders.",
      async options({
        page, teamId, folderType, includeSubfolders = false,
      }) {
        return await this.listRootFolders({
          folderType,
          teamId,
          limit: LIMIT,
          offset: LIMIT * page,
          includeSubfolders,
        });
      },
    },
    folderType: {
      type: "string",
      label: "Folder Type",
      description: "Whether to retrieve team folders or privatespace folders",
      async options() {
        return [
          "My Folders",
          "Team Folders",
        ];
      },
    },
  },
  methods: {
    _apiUrl(path, params = "") {
      return `https://workdrive.${this.$auth.base_api_uri}/api/v1/${path}${params
        ? `?${params}`
        : ""}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async _makeRequest({
      path, params, headers, ...opts
    }) {
      const config = {
        url: this._apiUrl(path, params),
        headers: this._getHeaders(headers),
        ...opts,
      };

      const { data } = await axios(config);
      return data;
    },
    getPrivateSpace({
      teamCurrentUserId, ...args
    }) {
      return this._makeRequest({
        path: `users/${teamCurrentUserId}/privatespace`,
        ...args,
      });
    },
    getTeamCurrentUser({
      teamId, ...args
    }) {
      return this._makeRequest({
        path: `teams/${teamId}/currentuser`,
        ...args,
      });
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "users/me",
        ...args,
      });
    },
    listFiles({
      folderId, params = "", filter = "folder", sort = "name", ...args
    }) {
      return this._makeRequest({
        path: `files/${folderId}/files`,
        params: `${params}&filter%5Btype%5D=${filter}&sort=${sort}`,
        ...args,
      });
    },
    async listRootFolders({
      teamId, folderType, limit, offset, params = {}, includeSubfolders = true, ...args
    }) {
      const { data: { id: teamCurrentUserId } } = await this.getTeamCurrentUser({
        teamId,
      });

      const {
        data: [
          { id: privateSpaceId },
        ],
      } = await this.getPrivateSpace({
        teamCurrentUserId,
      });
      params["page[limit]"] = limit;
      params["page[offset]"] = offset;
      params["sort"] = "name";
      const reponseArray = [];
      const { data: rootFolders } = await this._makeRequest({
        path: folderType === "Team Folders"
          ? `/teams/${teamId}/teamfolders`
          : `privatespace/${privateSpaceId}/folders`,
        params: new URLSearchParams(params).toString(),
        ...args,
      });

      for (const {
        id, attributes,
      } of rootFolders) {
        reponseArray.push({
          value: id,
          label: attributes.name,
        });
        if (includeSubfolders) {
          const subFolders = await this.paginateFolders({
            folderId: id,
            prefix: "- ",
          });
          reponseArray.push(...subFolders);
        }
      }
      return reponseArray;
    },
    listTeams({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `users/${userId}/teams`,
        ...args,
      });
    },
    uploadFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "upload",
        ...args,
      });
    },
    downloadFile({
      fileId, ...args
    }) {
      return this._makeRequest({
        url: `https://download.${this.$auth.base_api_uri}/v1/workdrive/download/${fileId}`,
        responseType: "arraybuffer",
        ...args,
      });
    },
    async paginateFolders({
      folderId, prefix = "", params = {},
    }) {
      let hasMore = false;
      let page = 0;
      const responseArray = [];

      do {
        params["page[limit]"] = LIMIT;
        params["page[offset]"] = LIMIT * page;
        page++;

        const { data: subFolders } = await this.listFiles({
          folderId,
          params: new URLSearchParams(params).toString(),
        });

        for (const {
          id, attributes: { name },
        } of subFolders) {
          responseArray.push({
            value: id,
            label: `${prefix}${name}`,
          });
          responseArray.push(...await this.paginateFolders({
            folderId: id,
            prefix: `${prefix}- `,
          }));
        }

        hasMore = subFolders.length;
      } while (hasMore);

      return responseArray;
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params["page[limit]"] = LIMIT;
        params["page[offset]"] = LIMIT * page;
        page++;

        const { data } = await fn({
          params: new URLSearchParams(params).toString(),
          ...args,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
