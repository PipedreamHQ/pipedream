// Transport: DDG's remote MCP server over Streamable HTTP (stateless JSON-RPC POST).
// Verified live: initialize + tools/list (54 tools) + tools/call all work with a
// plain POST, no session id, no auth.
import { axios } from "@pipedream/platform";

const MCP_URL = "https://mcp.daedalusdevelopmentgroup.com/mcp";

export default {
  type: "app",
  app: "ddg",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description:
        "A stable identifier for the calling agent, forwarded as `agent_id` (MCP) / `X-Agent-Id` (HTTP)."
        + " It keys DDG's per-agent free tier and order/payment scoping; reuse the same value for one agent, e.g. `my-research-agent`.",
      optional: true,
    },
  },
  methods: {
    _mcpUrl() {
      return MCP_URL;
    },
    async _rpc($, method, params) {
      const res = await axios($ ?? this, {
        method: "POST",
        url: this._mcpUrl(),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/event-stream",
        },
        data: {
          jsonrpc: "2.0",
          id: 1,
          method,
          params,
        },
      });
      if (res?.error) {
        throw new Error(`DDG MCP ${method} failed: ${res.error.message}`);
      }
      return res?.result;
    },
    async _callTool($, name, args = {}) {
      const result = await this._rpc($, "tools/call", {
        name,
        arguments: args,
      });

      let payload;
      if (result?.structuredContent) {
        payload = result.structuredContent;
      } else {
        const text = result?.content?.[0]?.text ?? "{}";
        try {
          payload = JSON.parse(text);
        } catch (err) {
          payload = {
            text,
          };
        }
      }

      // x402 payment challenges (status 402) are valid payloads, not tool errors.
      if (result?.isError && payload?.status !== 402) {
        const message =
          payload?.error ?? payload?.message ?? payload?.text ?? "Tool call failed";
        throw new Error(`DDG MCP tool ${name} failed: ${message}`);
      }

      return payload;
    },
    async searchServices($, {
      need, topK,
    } = {}) {
      return this._callTool($, "ddg_search_services", {
        need,
        ...(topK
          ? {
            top_k: topK,
          }
          : {}),
      });
    },
    async listServices($) {
      return this._callTool($, "ddg_list_services", {});
    },
    async callService($, {
      service, args, agentId,
    } = {}) {
      return this._callTool($, "ddg_call", {
        service,
        args: args ?? {},
        ...(agentId
          ? {
            agent_id: agentId,
          }
          : {}),
      });
    },
  },
};
