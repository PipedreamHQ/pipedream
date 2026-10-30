import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-get-lead",
  name: "Get Lead",
  description: "Reads one lead by id. Returns nothing when the key cannot see it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: true },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Lead ID",
      description: "The id of the lead, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const record = await this.syncOne.getById({ $, path: "/leads", id: this.id });
    $.export("$summary", record ? `Found lead ${this.id}` : "No lead with that id");
    return record;
  },
};
