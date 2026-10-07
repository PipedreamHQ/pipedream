import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "quilt",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of a task on the session's board. Use the **List Tasks** action to see each task's ID.",
    },
    person: {
      type: "string",
      label: "Person",
      description: "The name of a person (or agent) in the session, as shown by the **Get Session Status** action",
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "Project files, as paths relative to the project folder, e.g. `src/app.js`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    /** The agent this key signs in: its profile, org and teams. */
    getMe(opts = {}) {
      return this._makeRequest({
        path: "/v1/agents/me",
        ...opts,
      });
    },
    /**
     * Calls one of Quilt's MCP tools as the connected agent. Quilt's hosted MCP is
     * stateless, so one JSON-RPC request per call is enough. Returns the tool's text;
     * a tool that refuses (isError) throws with Quilt's explanation.
     */
    async callTool({
      $ = this, name, args = {},
    }) {
      const response = await this._makeRequest({
        $,
        method: "POST",
        path: "/mcp",
        headers: {
          "Accept": "application/json, text/event-stream",
          "Content-Type": "application/json",
          "MCP-Protocol-Version": constants.MCP_PROTOCOL_VERSION,
        },
        data: {
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name,
            arguments: this._clean(args),
          },
        },
      });
      if (response?.error) {
        throw new Error(`Quilt: ${response.error.message || JSON.stringify(response.error)}`);
      }
      const result = response?.result || {};
      const text = (result.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");
      if (result.isError) {
        throw new Error(text || `Quilt refused ${name}`);
      }
      return text;
    },
    /** Leaves out arguments that were not set, so Quilt's defaults apply. */
    _clean(args) {
      return Object.fromEntries(Object.entries(args)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null && !(Array.isArray(value) && !value.length)));
    },
    listTools(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/mcp",
        headers: {
          "Accept": "application/json, text/event-stream",
          "Content-Type": "application/json",
          "MCP-Protocol-Version": constants.MCP_PROTOCOL_VERSION,
        },
        data: {
          jsonrpc: "2.0",
          id: 1,
          method: "tools/list",
        },
        ...opts,
      });
    },
  },
};
