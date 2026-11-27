import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-get-deal",
  name: "Get Deal",
  description: "Reads one deal by id. Returns nothing when the key cannot see it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: true },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Deal ID",
      description: "The id of the deal, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const record = await this.syncOne.getById({ $, path: "/opportunities", id: this.id });
    $.export("$summary", record ? `Found deal ${this.id}` : "No deal with that id");
    return record;
  },
};
