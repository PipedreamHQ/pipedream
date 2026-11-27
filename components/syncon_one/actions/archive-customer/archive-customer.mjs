import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-archive-customer",
  name: "Archive Customer",
  description:
    "Archives a customer: it leaves the lists and can be restored by the team. This does not erase it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Customer ID",
      description: "The id of the customer, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const response = await this.syncOne.archive({ $, path: "/people", id: this.id });
    $.export("$summary", `Archived customer ${this.id}`);
    return response.data;
  },
};
