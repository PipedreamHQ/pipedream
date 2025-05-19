import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserbase",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the session",
      async options() {
        const sessions = await this.listSessions();
        return sessions.map((session) => ({
          value: session.id,
          label: session.id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          value: project.id,
          label: project.name,
        }));
      },
    },
    extensionId: {
      type: "string",
      label: "Extension ID",
      description: "The uploaded Extension ID",
      optional: true,
    },
    browserSettings: {
      type: "object",
      label: "Browser Settings",
      description: "The settings for the browser",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Duration in seconds after which the session will automatically end.",
      optional: true,
      min: 60,
      max: 21600,
    },
    keepAlive: {
      type: "boolean",
      label: "Keep Alive",
      description: "Set to true to keep the session alive even after disconnections.",
      optional: true,
    },
    proxies: {
      type: "string[]",
      label: "Proxies",
      description: "Proxy configuration. Can be true for default proxy, or an array of proxy configurations.",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region where the session should run.",
      options: [
        {
          label: "US West 2",
          value: "us-west-2",
        },
        {
          label: "US East 1",
          value: "us-east-1",
        },
        {
          label: "EU Central 1",
          value: "eu-central-1",
        },
        {
          label: "AP Southeast 1",
          value: "ap-southeast-1",
        },
      ],
      optional: true,
    },
    userMetadata: {
      type: "object",
      label: "User Metadata",
      description: "Arbitrary user metadata to attach to the session.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.browserbase.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-BB-API-Key": this.$auth.api_key,
        },
      });
    },
    async listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    async listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...opts,
      });
    },
    async createSession(opts = {}) {
      const {
        projectId, extensionId, browserSettings, timeout, keepAlive, proxies, region, userMetadata, ...otherOpts
      } = opts;
      const data = {
        projectId,
        extensionId,
        browserSettings,
        timeout,
        keepAlive,
        proxies,
        region,
        userMetadata,
      };
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        data,
        ...otherOpts,
      });
    },
    async createContext(opts = {}) {
      const {
        projectId, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/contexts",
        data: {
          projectId,
        },
        ...otherOpts,
      });
    },
    async getSessionLogs(opts = {}) {
      const {
        sessionId, ...otherOpts
      } = opts;
      return this._makeRequest({
        path: `/sessions/${sessionId}/logs`,
        ...otherOpts,
      });
    },
  },
  hooks: {
    async activate() {
      this._checkForNewProjects();
      this._checkForNewSessions();
    },
  },
  async _checkForNewProjects() {
    const projects = await this.listProjects();
    for (const project of projects) {
      this.$emit(project, {
        id: project.id,
        summary: project.name,
        ts: new Date().getTime(),
      });
    }
  },
  async _checkForNewSessions() {
    const sessions = await this.listSessions();
    for (const session of sessions) {
      this.$emit(session, {
        id: session.id,
        summary: `New session: ${session.id}`,
        ts: new Date().getTime(),
      });
    }
  },
  async _checkForNewLogs(sessionId) {
    const logs = await this.getSessionLogs({
      sessionId,
    });
    for (const log of logs) {
      this.$emit(log, {
        id: log.id,
        summary: `Log for session: ${sessionId}`,
        ts: new Date().getTime(),
      });
    }
  },
};
