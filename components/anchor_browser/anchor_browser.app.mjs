import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anchor_browser",
  propDefinitions: {
    name: {
      type: "string",
      label: "Profile Name",
      description: "The name of the profile.",
    },
    description: {
      type: "string",
      label: "Profile Description",
      description: "The description of the profile.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the profile data. currently only `session` is supported.",
      options: [
        "session",
      ],
      default: "session",
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The session ID is required if the source is set to session. The session must be running, and the profile will be stored once the session terminates.",
      async options() {
        const sessions = await this.listSessions();
        return sessions.map(({ session_id: value }) => value);
      },
    },
    profileName: {
      type: "string",
      label: "Profile Name",
      description: "The name of the profile to update.",
      async options() {
        const { data: profiles } = await this.listProfiles();
        return profiles.map(({ name: value }) => value);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.anchorbrowser.io/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "anchor-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listSessions(args = {}) {
      return this._makeRequest({
        path: "/sessions/active",
        ...args,
      });
    },
    listProfiles(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...args,
      });
    },
  },
};
