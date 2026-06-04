import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "e2b",
  methods: {
    _apiUrl() {
      return `https://api.${constants.DEFAULT_DOMAIN}`;
    },
    _headers() {
      return {
        "X-API-KEY": this.$auth.api_key,
      };
    },
    _makeRequest({
      $, path, url, headers, ...opts
    } = {}) {
      return axios($, {
        url: url || `${this._apiUrl()}${path}`,
        headers: headers || this._headers(),
        ...opts,
      });
    },
    createSandbox({ $ } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/sandboxes",
        data: {
          templateID: constants.TEMPLATE_ID,
          timeout: constants.DEFAULT_SANDBOX_TIMEOUT_SECONDS,
          autoPause: false,
          secure: true,
          allow_internet_access: true,
        },
      });
    },
    killSandbox({
      $, sandboxId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/sandboxes/${sandboxId}`,
      });
    },
    async executeCode({
      $, sandbox, code,
    } = {}) {
      const domain = sandbox.domain || constants.DEFAULT_DOMAIN;
      const response = await this._makeRequest({
        $,
        method: "POST",
        url: `https://${constants.CODE_INTERPRETER_PORT}-${sandbox.sandboxID}.${domain}/execute`,
        // secure sandboxes forward this access token into the execution context
        headers: {
          ...(sandbox.envdAccessToken && {
            "X-Access-Token": sandbox.envdAccessToken,
          }),
        },
        data: {
          code,
        },
        // the execution output is a newline-delimited JSON stream, not a single JSON document
        transformResponse: (data) => data,
      });
      return this.parseExecution(response);
    },
    // Mirrors the @e2b/code-interpreter SDK's Execution shape so the action's
    // return value stays backwards-compatible
    parseExecution(raw) {
      const execution = {
        results: [],
        logs: {
          stdout: [],
          stderr: [],
        },
        error: null,
      };
      const lines = raw.split("\n").filter(Boolean);
      for (const line of lines) {
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          throw new Error(`Unexpected execution output from E2B: ${line}`);
        }
        switch (msg.type) {
        case "result": {
          const result = {
            ...msg,
            isMainResult: msg.is_main_result,
          };
          delete result.type;
          delete result.is_main_result;
          execution.results.push(result);
          break;
        }
        case "stdout":
          execution.logs.stdout.push(msg.text);
          break;
        case "stderr":
          execution.logs.stderr.push(msg.text);
          break;
        case "error":
          execution.error = {
            name: msg.name,
            value: msg.value,
            traceback: msg.traceback,
          };
          break;
        case "number_of_executions":
          execution.executionCount = msg.execution_count;
          break;
        }
      }
      return execution;
    },
    async runCode({
      $, code,
    } = {}) {
      const sandbox = await this.createSandbox({
        $,
      });
      try {
        return await this.executeCode({
          $,
          sandbox,
          code,
        });
      } finally {
        try {
          await this.killSandbox({
            $,
            sandboxId: sandbox.sandboxID,
          });
        } catch {
          // best-effort cleanup; the sandbox auto-expires after its timeout
        }
      }
    },
  },
};
