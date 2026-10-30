import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-get-customer",
  name: "Get Customer",
  description: "Reads one customer by id. Returns nothing when the key cannot see it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: true },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Customer ID",
      description: "The id of the customer, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const record = await this.syncOne.getById({ $, path: "/people", id: this.id });
    $.export("$summary", record ? `Found customer ${this.id}` : "No customer with that id");
    return record;
  },
};
