import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faxtofax",
  propDefinitions: {
    fromNumber: {
      type: "string",
      label: "From Number",
      description: "Which of your FaxToFax numbers to send from. Leave empty to use your first number.",
      optional: true,
      async options() {
        const { numbers } = await this.callTool({ name: "list_numbers" });
        return numbers.map((n) => ({ label: n.label ? `${n.label} (${n.number})` : n.number, value: n.number }));
      },
    },
    faxId: {
      type: "string",
      label: "Fax ID",
      description: "The fax ID returned by **Send Fax** or **List Faxes**.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://faxtofax.com/api/mcp";
    },
    // FaxToFax exposes its API as MCP tools (JSON-RPC over HTTPS), authenticated with an API key.
    async callTool({ $ = this, name, args = {} }) {
      const res = await axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        data: { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } },
      });
      if (res.error) throw new Error(res.error.message);
      const result = res.result || {};
      const text = result.content?.find((c) => c.type === "text")?.text;
      if (result.isError) throw new Error(text || "FaxToFax returned an error");
      if (result.structuredContent) return result.structuredContent;
      const blob = result.content?.find((c) => c.type === "resource")?.resource;
      return blob || (text ? JSON.parse(text) : {});
    },
    sendFax(opts) {
      return this.callTool({ ...opts, name: "send_fax" });
    },
    getFax(opts) {
      return this.callTool({ ...opts, name: "get_fax_status" });
    },
    listFaxes(opts) {
      return this.callTool({ ...opts, name: "list_faxes" });
    },
  },
};
