import faxtofax from "../../faxtofax.app.mjs";

export default {
  key: "faxtofax-list-faxes",
  name: "List Faxes",
  description: "List recent sent and received faxes, newest first. [See the documentation](https://faxtofax.com/integrations/mcp)",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: true },
  props: {
    faxtofax,
    direction: {
      type: "string",
      label: "Direction",
      options: ["inbound", "outbound"],
      optional: true,
    },
    query: {
      type: "string",
      label: "Search",
      description: "Search by name, number or subject.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      min: 1,
      max: 100,
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    const { faxes } = await this.faxtofax.listFaxes({
      $,
      params: {
        direction: this.direction,
        query: this.query,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${faxes.length} fax${faxes.length === 1 ? "" : "es"}`);
    return faxes;
  },
};
