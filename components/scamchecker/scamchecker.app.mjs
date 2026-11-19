import { randomUUID } from "node:crypto";
import { axios } from "@pipedream/platform";

const BASE_URL = "https://scamchecker.nl";

// The API returns Dutch verdict values; translate them to English.
const VERDICTS = {
  nep: "fake",
  verdacht: "suspicious",
  geen_rode_vlaggen: "no_red_flags",
  onduidelijk: "unclear",
};

export default {
  type: "app",
  app: "scamchecker",
  propDefinitions: {
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The suspicious email, SMS or WhatsApp text to check. Max 8,000 characters.",
    },
    messageUrl: {
      type: "string",
      label: "Message URL",
      description: "A link from the message, e.g. `https://example.com/login`. When set, Scamchecker checks the link itself instead of the message text.",
      optional: true,
    },
  },
  methods: {
    /**
     * Call one tool on the Scamchecker MCP endpoint (stateless JSON-RPC 2.0)
     * and return the `result` object of the tool call.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {string} toolName - the name of the tool to call
     * @param {object} toolArguments - the arguments passed to the tool
     * @returns {object} the `result` object from the JSON-RPC response
     */
    async _callTool($, toolName, toolArguments = {}) {
      const response = await axios($, {
        method: "POST",
        url: `${BASE_URL}/mcp`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data: {
          jsonrpc: "2.0",
          id: randomUUID(),
          method: "tools/call",
          params: {
            name: toolName,
            arguments: toolArguments,
          },
        },
      });
      if (response.error) {
        throw new Error(response.error.message ?? "The request to Scamchecker failed.");
      }
      const result = response.result ?? {};
      if (result.isError) {
        const text = (result.content ?? []).find((entry) => entry.type === "text")?.text;
        throw new Error(text ?? "The operation failed in Scamchecker.");
      }
      return result;
    },
    /**
     * Check a suspicious message and return the structured check result, with
     * the Dutch verdict value translated to English (`fake`, `suspicious`,
     * `no_red_flags` or `unclear`).
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {string} text - the suspicious message text
     * @param {string} [url] - a link from the message; when set, Scamchecker
     * checks the link itself instead of the text
     * @returns {object} the check result
     */
    async checkMessage($, {
      text, url,
    }) {
      const toolArguments = {
        text,
      };
      if (url) {
        toolArguments.url = url;
      }
      const { structuredContent } = await this._callTool($, "check_message", toolArguments);
      const check = structuredContent ?? {};
      return {
        ...check,
        verdict: VERDICTS[check.verdict] ?? check.verdict,
      };
    },
  },
};
