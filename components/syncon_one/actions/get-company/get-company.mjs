import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-get-company",
  name: "Get Company",
  description: "Reads one company by id. Returns nothing when the key cannot see it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: true },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Company ID",
      description: "The id of the company, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const record = await this.syncOne.getById({ $, path: "/companies", id: this.id });
    $.export("$summary", record ? `Found company ${this.id}` : "No company with that id");
    return record;
  },
};
