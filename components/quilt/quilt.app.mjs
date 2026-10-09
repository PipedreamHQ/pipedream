import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "quilt",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of a task on the session's board, e.g. `bbf50762cef7109d`. Use **List Tasks** to find it (the ID is shown before each task's title).",
    },
    person: {
      type: "string",
      label: "Person",
      description: "The name of a person or agent in the session, e.g. `Ana`. Use **Get Session Status** to list who is in the session.",
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "Project files as paths relative to the project folder, e.g. `[\"src/app.js\", \"README.md\"]`. Use **Get Session Status** or the `quilt_list_files` tool in **Call Tool** to see the project's files.",
      optional: true,
    },
    toAi: {
      type: "boolean",
      label: "Assign to Their AI",
      description: "Set to `true` to give the task to that person's AI instead of the person, e.g. `true`. Leave unset to assign the person.",
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "A file's path relative to the project folder, e.g. `src/app.js`. Use the `quilt_list_files` tool in **Call Tool** to see the project's files.",
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
    /**
     * Sends one JSON-RPC request to Quilt's hosted MCP. It is stateless, so no session is
     * set up first. Handles JSON and text/event-stream answers, and throws on a JSON-RPC error.
     * @returns {Promise<object>} the request's result
     */
    async _rpc({
      $ = this, method, params,
    }) {
      const id = 1;
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
          id,
          method,
          ...(params
            ? {
              params,
            }
            : {}),
        },
      });
      const message = utils.rpcMessage(response, id);
      if (message.error) {
        throw new Error(`Quilt: ${message.error.message || JSON.stringify(message.error)}`);
      }
      return message.result || {};
    },
    /**
     * The agent this key signs in: its profile, org and teams.
     * @returns {Promise<object>}
     */
    getMe(opts = {}) {
      return this._makeRequest({
        path: "/v1/agents/me",
        ...opts,
      });
    },
    /**
     * Calls one of Quilt's agent tools as the connected agent.
     * @returns {Promise<string>} the tool's text; a refusal throws with Quilt's explanation
     */
    async callTool({
      $ = this, name, args = {},
    }) {
      const result = await this._rpc({
        $,
        method: "tools/call",
        params: {
          name,
          arguments: utils.cleanArgs(args),
        },
      });
      const text = (result.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");
      if (result.isError) {
        throw new Error(text || `Quilt refused ${name}`);
      }
      return text;
    },
    /**
     * The agent tools Quilt offers this agent, with their descriptions and input schemas.
     * @returns {Promise<object[]>}
     */
    async listTools(opts = {}) {
      const result = await this._rpc({
        ...opts,
        method: "tools/list",
      });
      return result.tools || [];
    },
  },
};
