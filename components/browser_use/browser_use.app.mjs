import { axios } from "@pipedream/platform";
import {
  BROWSER_SESSION_STATUS_OPTIONS,
  DEFAULT_OPTIONS_PAGE_SIZE,
  MODEL_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "browser_use",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Select a Browser Use agent session or provide a session ID.",
      async options({ prevContext }) {
        const page = prevContext?.page ?? 1;
        const response = await this.listSessions({
          params: {
            page,
            page_size: DEFAULT_OPTIONS_PAGE_SIZE,
          },
        });
        const sessions = response.sessions ?? [];
        return {
          options: sessions.map((session) => ({
            label: `${session.title || session.id} (${session.status})`,
            value: session.id,
          })),
          context: response.total > page * DEFAULT_OPTIONS_PAGE_SIZE
            ? {
              page: page + 1,
            }
            : {},
        };
      },
    },
    browserSessionId: {
      type: "string",
      label: "Browser Session ID",
      description: "Select a Browser Use browser session or provide a browser session ID.",
      async options({ prevContext }) {
        const pageNumber = prevContext?.pageNumber ?? 1;
        const response = await this.listBrowserSessions({
          params: {
            pageNumber,
            pageSize: DEFAULT_OPTIONS_PAGE_SIZE,
          },
        });
        const sessions = response.items ?? [];
        return {
          options: sessions.map((session) => ({
            label: `${session.id} (${session.status})`,
            value: session.id,
          })),
          context: response.totalItems > pageNumber * DEFAULT_OPTIONS_PAGE_SIZE
            ? {
              pageNumber: pageNumber + 1,
            }
            : {},
        };
      },
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "Select a Browser Use profile or provide a profile ID.",
      optional: true,
      async options({ prevContext }) {
        const pageNumber = prevContext?.pageNumber ?? 1;
        const response = await this.listProfiles({
          params: {
            pageNumber,
            pageSize: DEFAULT_OPTIONS_PAGE_SIZE,
          },
        });
        const profiles = response.items ?? [];
        return {
          options: profiles.map((profile) => ({
            label: profile.name
              ? `${profile.name} (${profile.id})`
              : profile.id,
            value: profile.id,
          })),
          context: response.totalItems > pageNumber * DEFAULT_OPTIONS_PAGE_SIZE
            ? {
              pageNumber: pageNumber + 1,
            }
            : {},
        };
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Select a Browser Use workspace or provide a workspace ID.",
      optional: true,
      async options({ prevContext }) {
        const pageNumber = prevContext?.pageNumber ?? 1;
        const response = await this.listWorkspaces({
          params: {
            pageNumber,
            pageSize: DEFAULT_OPTIONS_PAGE_SIZE,
          },
        });
        const workspaces = response.items ?? [];
        return {
          options: workspaces.map((workspace) => ({
            label: workspace.name
              ? `${workspace.name} (${workspace.id})`
              : workspace.id,
            value: workspace.id,
          })),
          context: response.totalItems > pageNumber * DEFAULT_OPTIONS_PAGE_SIZE
            ? {
              pageNumber: pageNumber + 1,
            }
            : {},
        };
      },
    },
    model: {
      type: "string",
      label: "Model",
      description: "Browser Use agent model. `claude-sonnet-4.6` is balanced, `claude-opus-4.6` is most capable, and `gemini-3-flash` is fast and lower cost.",
      options: MODEL_OPTIONS,
      optional: true,
      default: "claude-sonnet-4.6",
    },
    proxyCountryCode: {
      type: "string",
      label: "Proxy Country Code",
      description: "Lowercase proxy country code for browser traffic. Examples: `us`, `de`, `jp`. Enter `none` to disable Browser Use's proxy.",
      optional: true,
      default: "us",
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of records to return per page. Maximum: `100`.",
      optional: true,
      default: 20,
      min: 1,
      max: 100,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "Page number to fetch. The first page is `1`.",
      optional: true,
      default: 1,
      min: 1,
    },
    browserSessionStatus: {
      type: "string",
      label: "Browser Session Status",
      description: "Filter browser sessions by status.",
      options: BROWSER_SESSION_STATUS_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.browser-use.com/api/v3";
    },
    _headers(headers = {}) {
      return {
        "X-Browser-Use-API-Key": this.$auth.api_key,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
      });
    },
    uploadToPresignedUrl({
      $ = this, uploadUrl, content, contentType, contentLength,
    } = {}) {
      return axios($, {
        method: "PUT",
        url: uploadUrl,
        headers: {
          "Content-Type": contentType,
          ...(contentLength != null && {
            "Content-Length": contentLength,
          }),
        },
        data: content,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    },
    createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        ...opts,
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...opts,
      });
    },
    getSession({
      sessionId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/sessions/${encodeURIComponent(sessionId)}`,
        ...opts,
      });
    },
    deleteSession({
      sessionId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/sessions/${encodeURIComponent(sessionId)}`,
        ...opts,
      });
    },
    stopSession({
      sessionId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${encodeURIComponent(sessionId)}/stop`,
        ...opts,
      });
    },
    listSessionMessages({
      sessionId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/sessions/${encodeURIComponent(sessionId)}/messages`,
        ...opts,
      });
    },
    listBrowserSessions(opts = {}) {
      return this._makeRequest({
        path: "/browsers",
        ...opts,
      });
    },
    createBrowserSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/browsers",
        ...opts,
      });
    },
    getBrowserSession({
      browserSessionId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/browsers/${encodeURIComponent(browserSessionId)}`,
        ...opts,
      });
    },
    updateBrowserSession({
      browserSessionId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/browsers/${encodeURIComponent(browserSessionId)}`,
        ...opts,
      });
    },
    listProfiles(opts = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...opts,
      });
    },
    createProfile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/profiles",
        ...opts,
      });
    },
    getProfile({
      profileId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/profiles/${encodeURIComponent(profileId)}`,
        ...opts,
      });
    },
    updateProfile({
      profileId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/profiles/${encodeURIComponent(profileId)}`,
        ...opts,
      });
    },
    deleteProfile({
      profileId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/profiles/${encodeURIComponent(profileId)}`,
        ...opts,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    createWorkspace(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/workspaces",
        ...opts,
      });
    },
    getWorkspace({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/workspaces/${encodeURIComponent(workspaceId)}`,
        ...opts,
      });
    },
    updateWorkspace({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/workspaces/${encodeURIComponent(workspaceId)}`,
        ...opts,
      });
    },
    deleteWorkspace({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/workspaces/${encodeURIComponent(workspaceId)}`,
        ...opts,
      });
    },
    listWorkspaceFiles({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/workspaces/${encodeURIComponent(workspaceId)}/files`,
        ...opts,
      });
    },
    deleteWorkspaceFile({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/workspaces/${encodeURIComponent(workspaceId)}/files`,
        ...opts,
      });
    },
    getWorkspaceSize({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/workspaces/${encodeURIComponent(workspaceId)}/size`,
        ...opts,
      });
    },
    uploadWorkspaceFiles({
      workspaceId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${encodeURIComponent(workspaceId)}/files/upload`,
        ...opts,
      });
    },
    getAccountBilling(opts = {}) {
      return this._makeRequest({
        path: "/billing/account",
        ...opts,
      });
    },
  },
};
