import { axios } from "@pipedream/platform";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const TRANSFORM_MCP_URL = "https://mcp.transform.unstructured.io";

class TransformToolError extends Error {
  constructor(error) {
    super(error.message || JSON.stringify(error));
    this.code = error.code;
  }
}

const toolPayload = (result) => {
  const text = result.content?.find(({ type }) => type === "text")?.text;
  let payload = result.structuredContent?.result ?? result.structuredContent;
  if (!payload && text) {
    try {
      payload = JSON.parse(text);
    } catch {
      if (result.isError) throw new Error(text);
      throw new Error("Transform MCP returned invalid JSON content");
    }
  }
  if (payload?.error) {
    throw new TransformToolError(payload.error);
  }
  if (result.isError) {
    if (payload?.code || payload?.message) {
      throw new TransformToolError(payload);
    }
    throw new Error(text || "Transform MCP tool call failed");
  }
  if (!payload) throw new Error("Transform MCP returned no content");
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
    async _withTransformClient(callback) {
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
    async _callTransformTool(name, args) {
      return this._withTransformClient(async (client) =>
        toolPayload(await client.callTool({
          name,
          arguments: args,
        })));
    },
    /**
     * Requests a signed upload URL for a Transform source file.
     *
     * @param {object} args - Upload metadata.
     * @returns {Promise<object>} Upload URL, headers, and file reference.
     */
    requestTransformUpload(args) {
      return this._callTransformTool("request_file_upload_url", args);
    },
    /**
     * Starts an asynchronous Transform job.
     *
     * @param {object} args - Source file references and Transform stages.
     * @returns {Promise<object>} Transform job metadata.
     */
    startTransformJob(args) {
      return this._callTransformTool("start_transform_job", args);
    },
    /**
     * Gets the current status of a Transform job.
     *
     * @param {object} args - Transform job identifier.
     * @returns {Promise<object>} Current Transform job status.
     */
    checkTransformJobStatus(args) {
      return this._callTransformTool("check_job_status", args);
    },
    /**
     * Gets the materialized results for a completed Transform job.
     *
     * @param {object} args - Transform job identifier and output options.
     * @returns {Promise<object>} Transform output files.
     */
    getTransformJobResults(args) {
      return this._callTransformTool("get_job_results", args);
    },
  },
};
