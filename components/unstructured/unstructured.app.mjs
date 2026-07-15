import { axios } from "@pipedream/platform";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const TRANSFORM_MCP_URL = "https://mcp.transform.unstructured.io";

const toolPayload = (result) => {
  if (result.isError) {
    const message = result.content?.find(({ type }) => type === "text")?.text
      || "Transform MCP tool call failed";
    throw new Error(message);
  }

  let payload = result.structuredContent?.result ?? result.structuredContent;
  if (!payload) {
    const text = result.content?.find(({ type }) => type === "text")?.text;
    if (!text) throw new Error("Transform MCP returned no content");
    payload = JSON.parse(text);
  }
  if (payload.error) {
    throw new Error(payload.error.message || JSON.stringify(payload.error));
  }
  return payload;
};

export default {
  type: "app",
  app: "unstructured",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.url;
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "unstructured-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    extractFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/general/v0/general",
        ...opts,
      });
    },
    async withTransformClient(callback) {
      const client = new Client({
        name: "pipedream-unstructured",
        version: "1.0.0",
      });
      const transport = new StreamableHTTPClientTransport(
        new URL(TRANSFORM_MCP_URL),
        {
          requestInit: {
            headers: {
              Authorization: `Bearer ${this.$auth.api_key}`,
            },
          },
        },
      );

      try {
        await client.connect(transport);
        return await callback(client);
      } finally {
        await client.close();
      }
    },
    async callTransformTool(client, name, args) {
      return toolPayload(await client.callTool({
        name,
        arguments: args,
      }));
    },
  },
};
