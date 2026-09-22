import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "trint",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of a workspace",
      async options() {
        const workspaces = await this.listWorkspaces();
        return workspaces?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of a folder",
      async options({ workspaceId }) {
        const folders = await this.listFolders({
          params: {
            "workspace-id": workspaceId,
          },
        });
        return folders?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    transcriptId: {
      type: "string",
      label: "Transcript ID",
      description: "The ID of a transcript",
      async options({ page }) {
        const transcripts = await this.listTranscripts({
          params: {
            limit: DEFAULT_LIMIT,
            skip: DEFAULT_LIMIT * page,
          },
        });
        return transcripts?.filter(({ fileType }) => fileType === "TRANSCRIPT")?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.trint.com";
    },
    _makeRequest({
      $ = this, url, path, headers, ...opts
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    registerWebhook(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/callbacks/transcript",
        ...opts,
      });
    },
    deregisterWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/callbacks/transcript",
        ...opts,
      });
    },
    getTranscript({
      format, transcriptId, ...opts
    }) {
      return this._makeRequest({
        path: `/export/${format}/${transcriptId}`,
        ...opts,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/folders",
        ...opts,
      });
    },
    listTranscripts(opts = {}) {
      return this._makeRequest({
        path: "/transcripts",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://upload.trint.com/",
        ...opts,
      });
    },
  },
};
