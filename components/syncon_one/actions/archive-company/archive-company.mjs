import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-archive-company",
  name: "Archive Company",
  description:
    "Archives a company: it leaves the lists and can be restored by the team. This does not erase it.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Company ID",
      description: "The id of the company, from an earlier step or a search.",
    },
  },
  async run({ $ }) {
    const response = await this.syncOne.archive({ $, path: "/companies", id: this.id });
    $.export("$summary", `Archived company ${this.id}`);
    return response.data;
  },
};
