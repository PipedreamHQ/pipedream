import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-archive-lead",
  name: "Archive Lead",
  description:
    "Archives a lead: it leaves the lists and can be restored by the team. This does not erase it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Lead ID",
      description: "The id of the lead, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const response = await this.syncOne.archive({ $, path: "/leads", id: this.id });
    $.export("$summary", `Archived lead ${this.id}`);
    return response.data;
  },
};
