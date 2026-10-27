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
        const { data: { items: sessions } } = await this.listSessions();
        return sessions
          .filter(({ status }) => status === "running")
          .map(({ session_id: value }) => value);
      },
    },
    profileName: {
      type: "string",
      label: "Profile Name",
      description: "The name of the profile, e.g. `my-profile`. Use **List Profile Name Options** to retrieve available profile names.",
      async options() {
        const { data: { items: profiles } } = await this.listProfiles();
        return profiles.map(({ name: value }) => value);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.anchorbrowser.io/v1${path}`;
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
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listSessions(args = {}) {
      return this._makeRequest({
        path: "/sessions/all/status",
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
